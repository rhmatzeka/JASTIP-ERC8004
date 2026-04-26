// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title JastipAgentRegistry
/// @notice ERC-8004-style deployment layer for Jastip Agent jastiper identity
/// and reputation. It intentionally keeps the hackathon MVP compact while
/// preserving the key concepts: agent identity, metadata URI, and trust updates.
contract JastipAgentRegistry {
    struct Agent {
        uint256 agentId;
        address wallet;
        string metadataURI;
        uint256 completedOrders;
        uint256 disputedOrders;
        uint256 averageVerificationScore;
        bool exists;
    }

    address public owner;
    uint256 public agentCounter;

    mapping(address => Agent) private agents;
    mapping(uint256 => address) public agentWalletById;

    event AgentRegistered(uint256 indexed agentId, address indexed wallet, string metadataURI);
    event ReputationUpdated(
        uint256 indexed agentId,
        address indexed wallet,
        uint256 completedOrders,
        uint256 disputedOrders,
        uint256 averageVerificationScore,
        int256 trustScore
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerAgent(address wallet, string calldata metadataURI) external returns (uint256 agentId) {
        require(wallet != address(0), "Wallet required");
        if (agents[wallet].exists) {
            return agents[wallet].agentId;
        }

        agentId = ++agentCounter;
        agents[wallet] = Agent({
            agentId: agentId,
            wallet: wallet,
            metadataURI: metadataURI,
            completedOrders: 0,
            disputedOrders: 0,
            averageVerificationScore: 0,
            exists: true
        });
        agentWalletById[agentId] = wallet;

        emit AgentRegistered(agentId, wallet, metadataURI);
    }

    function updateReputation(address wallet, bool completed, uint256 verificationScore) external onlyOwner {
        require(agents[wallet].exists, "Agent not registered");
        require(verificationScore <= 100, "Invalid score");

        Agent storage agent = agents[wallet];
        if (completed) {
            uint256 previousCompleted = agent.completedOrders;
            agent.completedOrders += 1;
            agent.averageVerificationScore =
                ((agent.averageVerificationScore * previousCompleted) + verificationScore) /
                agent.completedOrders;
        } else {
            agent.disputedOrders += 1;
        }

        emit ReputationUpdated(
            agent.agentId,
            wallet,
            agent.completedOrders,
            agent.disputedOrders,
            agent.averageVerificationScore,
            getTrustScore(wallet)
        );
    }

    function getAgent(address wallet) external view returns (Agent memory) {
        require(agents[wallet].exists, "Agent not registered");
        return agents[wallet];
    }

    function getTrustScore(address wallet) public view returns (int256) {
        require(agents[wallet].exists, "Agent not registered");
        Agent memory agent = agents[wallet];
        return int256(agent.completedOrders * 10 + agent.averageVerificationScore) - int256(agent.disputedOrders * 20);
    }
}
