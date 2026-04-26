import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.PLATFORM_TREASURY_ADDRESS || deployer.address;

  console.log("Deploying Jastip Agent contracts with:", deployer.address);
  console.log("Platform treasury:", treasury);

  const Escrow = await ethers.getContractFactory("JastipEscrow");
  const escrow = await Escrow.deploy(treasury);
  await escrow.waitForDeployment();

  const Registry = await ethers.getContractFactory("JastipAgentRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  console.log("NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=", await escrow.getAddress());
  console.log("NEXT_PUBLIC_AGENT_REGISTRY_CONTRACT_ADDRESS=", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
