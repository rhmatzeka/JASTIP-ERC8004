// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title JastipEscrow
/// @notice Buyer-funded escrow for Jastip Agent. This MVP accepts ETH on Sepolia as
/// the mock stablecoin payment rail, so IDRX or another token can be added later.
contract JastipEscrow {
    enum Status {
        CREATED,
        ACCEPTED,
        VERIFIED,
        RELEASED,
        DISPUTED,
        REFUNDED
    }

    struct Order {
        uint256 id;
        address buyer;
        address jastiper;
        uint256 amount;
        Status status;
        uint256 createdAt;
        uint256 acceptedAt;
        uint256 verifiedAt;
        uint256 autoReleaseAt;
        uint256 verificationScore;
    }

    address public platformTreasury;
    address public verificationOracle;
    uint256 public platformFeeBps = 300;
    uint256 public orderCounter;

    mapping(uint256 => Order) public orders;

    event OrderCreated(uint256 indexed orderId, address indexed buyer, uint256 amount);
    event OrderAccepted(uint256 indexed orderId, address indexed jastiper);
    event OrderVerified(uint256 indexed orderId, uint256 verificationScore, uint256 autoReleaseAt);
    event FundsReleased(uint256 indexed orderId, address indexed jastiper, uint256 jastiperAmount, uint256 platformFee);
    event DisputeOpened(uint256 indexed orderId);
    event BuyerRefunded(uint256 indexed orderId, address indexed buyer, uint256 amount);

    modifier onlyBuyer(uint256 orderId) {
        require(msg.sender == orders[orderId].buyer, "Only buyer");
        _;
    }

    modifier existingOrder(uint256 orderId) {
        require(orders[orderId].buyer != address(0), "Order not found");
        _;
    }

    constructor(address _platformTreasury) {
        require(_platformTreasury != address(0), "Treasury required");
        platformTreasury = _platformTreasury;
        verificationOracle = msg.sender;
    }

    function createOrder() external payable returns (uint256 orderId) {
        require(msg.value > 0, "Deposit required");

        orderId = ++orderCounter;
        orders[orderId] = Order({
            id: orderId,
            buyer: msg.sender,
            jastiper: address(0),
            amount: msg.value,
            status: Status.CREATED,
            createdAt: block.timestamp,
            acceptedAt: 0,
            verifiedAt: 0,
            autoReleaseAt: 0,
            verificationScore: 0
        });

        emit OrderCreated(orderId, msg.sender, msg.value);
    }

    function acceptOrder(uint256 orderId) external existingOrder(orderId) {
        Order storage order = orders[orderId];
        require(order.status == Status.CREATED, "Not open");
        require(msg.sender != order.buyer, "Buyer cannot accept");

        order.jastiper = msg.sender;
        order.status = Status.ACCEPTED;
        order.acceptedAt = block.timestamp;

        emit OrderAccepted(orderId, msg.sender);
    }

    function markVerified(uint256 orderId, uint256 verificationScore) external existingOrder(orderId) {
        Order storage order = orders[orderId];
        require(order.status == Status.ACCEPTED, "Not accepted");
        require(msg.sender == order.buyer || msg.sender == verificationOracle, "Not verification authority");
        require(verificationScore <= 100, "Invalid score");

        order.status = Status.VERIFIED;
        order.verifiedAt = block.timestamp;
        order.autoReleaseAt = block.timestamp + 72 hours;
        order.verificationScore = verificationScore;

        emit OrderVerified(orderId, verificationScore, order.autoReleaseAt);
    }

    function releaseFunds(uint256 orderId) external existingOrder(orderId) onlyBuyer(orderId) {
        _release(orderId);
    }

    function openDispute(uint256 orderId) external existingOrder(orderId) onlyBuyer(orderId) {
        Order storage order = orders[orderId];
        require(order.status == Status.ACCEPTED || order.status == Status.VERIFIED, "Cannot dispute");
        order.status = Status.DISPUTED;
        emit DisputeOpened(orderId);
    }

    function refundBuyer(uint256 orderId) external existingOrder(orderId) onlyBuyer(orderId) {
        Order storage order = orders[orderId];
        require(order.status == Status.DISPUTED || order.status == Status.ACCEPTED, "Cannot refund");

        uint256 amount = order.amount;
        order.amount = 0;
        order.status = Status.REFUNDED;

        (bool ok, ) = payable(order.buyer).call{value: amount}("");
        require(ok, "Refund failed");

        emit BuyerRefunded(orderId, order.buyer, amount);
    }

    function autoRelease(uint256 orderId) external existingOrder(orderId) {
        Order storage order = orders[orderId];
        require(order.status == Status.VERIFIED, "Not verified");
        require(block.timestamp >= order.autoReleaseAt, "Too early");
        _release(orderId);
    }

    function _release(uint256 orderId) internal {
        Order storage order = orders[orderId];
        require(order.status == Status.VERIFIED, "Not verified");
        require(order.jastiper != address(0), "No jastiper");

        uint256 amount = order.amount;
        order.amount = 0;
        order.status = Status.RELEASED;

        uint256 platformFee = (amount * platformFeeBps) / 10_000;
        uint256 jastiperAmount = amount - platformFee;

        (bool feeOk, ) = payable(platformTreasury).call{value: platformFee}("");
        require(feeOk, "Fee transfer failed");

        (bool payoutOk, ) = payable(order.jastiper).call{value: jastiperAmount}("");
        require(payoutOk, "Payout failed");

        emit FundsReleased(orderId, order.jastiper, jastiperAmount, platformFee);
    }
}
