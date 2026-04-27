import { ethers } from "ethers";

const ESCROW_ABI = [
  "function createOrder() payable returns (uint256)",
  "function acceptOrder(uint256 orderId)",
  "function markVerified(uint256 orderId,uint256 verificationScore)",
  "function releaseFunds(uint256 orderId)",
  "function openDispute(uint256 orderId)",
  "function refundBuyer(uint256 orderId)"
];

const REGISTRY_ABI = [
  "function registerAgent(address wallet,string metadataURI) returns (uint256)",
  "function updateReputation(address wallet,bool completed,uint256 verificationScore)"
];

function getSigner() {
  if (process.env.ENABLE_SERVER_CHAIN_WRITES !== "true") return null;
  const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  if (!rpcUrl || !privateKey) return null;
  return new ethers.Wallet(privateKey, new ethers.JsonRpcProvider(rpcUrl));
}

function idrToDemoEthWei(amountIdr: number) {
  const eth = Math.max(amountIdr / 1_000_000_000, 0.0001);
  return ethers.parseEther(eth.toFixed(8));
}

function mockHash(label: string) {
  return `mock-${label}-${Date.now().toString(16)}`;
}

export function sepoliaTxUrl(hash?: string) {
  if (!hash || hash.startsWith("mock-")) return "";
  return `https://sepolia.etherscan.io/tx/${hash}`;
}

export async function createEscrowOnChain(amountIdr: number) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  if (!signer || !address) {
    return { chainOrderId: `mock-${Date.now()}`, txHash: mockHash("create") };
  }

  const contract = new ethers.Contract(address, ESCROW_ABI, signer);
  const tx = await contract.createOrder({ value: idrToDemoEthWei(amountIdr) });
  const receipt = await tx.wait();
  const event = receipt.logs
    .map((log: ethers.Log) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((parsed: ethers.LogDescription | null) => parsed?.name === "OrderCreated");
  return {
    chainOrderId: event ? String(event.args.orderId) : String(Date.now()),
    txHash: tx.hash
  };
}

export async function acceptEscrowOnChain(chainOrderId?: string) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  if (!signer || !address || !chainOrderId || chainOrderId.startsWith("mock-")) return mockHash("accept");
  const contract = new ethers.Contract(address, ESCROW_ABI, signer);
  const tx = await contract.acceptOrder(BigInt(chainOrderId));
  await tx.wait();
  return tx.hash;
}

export async function markVerifiedOnChain(chainOrderId: string | undefined, verificationScore: number) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  if (!signer || !address || !chainOrderId || chainOrderId.startsWith("mock-")) return mockHash("verified");
  const contract = new ethers.Contract(address, ESCROW_ABI, signer);
  const tx = await contract.markVerified(BigInt(chainOrderId), verificationScore);
  await tx.wait();
  return tx.hash;
}

export async function releaseEscrowOnChain(chainOrderId?: string) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  if (!signer || !address || !chainOrderId || chainOrderId.startsWith("mock-")) return mockHash("release");
  const contract = new ethers.Contract(address, ESCROW_ABI, signer);
  const tx = await contract.releaseFunds(BigInt(chainOrderId));
  await tx.wait();
  return tx.hash;
}

export async function disputeEscrowOnChain(chainOrderId?: string) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS;
  if (!signer || !address || !chainOrderId || chainOrderId.startsWith("mock-")) return mockHash("dispute");
  const contract = new ethers.Contract(address, ESCROW_ABI, signer);
  const tx = await contract.openDispute(BigInt(chainOrderId));
  await tx.wait();
  return tx.hash;
}

export async function registerAgentOnChain(walletAddress: string, metadataURI: string) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS;
  if (!ethers.isAddress(walletAddress)) throw new Error("Invalid agent wallet address");
  if (!signer || !address) return mockHash("agent-register");
  const contract = new ethers.Contract(address, REGISTRY_ABI, signer);
  const tx = await contract.registerAgent(walletAddress, metadataURI);
  await tx.wait();
  return tx.hash;
}

export async function updateAgentReputationOnChain(walletAddress: string, completed: boolean, verificationScore: number) {
  const signer = getSigner();
  const address = process.env.NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS;
  if (!ethers.isAddress(walletAddress)) throw new Error("Invalid agent wallet address");
  if (!signer || !address) return mockHash("agent-reputation");
  const contract = new ethers.Contract(address, REGISTRY_ABI, signer);
  const tx = await contract.updateReputation(walletAddress, completed, verificationScore);
  await tx.wait();
  return tx.hash;
}
