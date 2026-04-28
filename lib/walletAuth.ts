import { verifyMessage } from "ethers";
import type { AppRole } from "./demoProfiles";

const LOGIN_MESSAGE_TITLE = "Jastip Nexus wallet login";
const LOGIN_MESSAGE_TTL_MS = 5 * 60 * 1000;

export function buildWalletLoginMessage({
  walletAddress,
  role,
  issuedAt
}: {
  walletAddress: string;
  role: AppRole;
  issuedAt: string;
}) {
  return [
    LOGIN_MESSAGE_TITLE,
    "",
    "Sign this message to create a Jastip Nexus session.",
    `Wallet: ${walletAddress.toLowerCase()}`,
    `Role: ${role}`,
    `Issued At: ${issuedAt}`
  ].join("\n");
}

export function verifyWalletLogin({
  walletAddress,
  role,
  message,
  signature
}: {
  walletAddress: string;
  role: AppRole;
  message: string;
  signature: string;
}) {
  const normalizedWallet = walletAddress.toLowerCase();
  const walletLine = message.match(/^Wallet: (0x[a-fA-F0-9]{40})$/m)?.[1]?.toLowerCase();
  const roleLine = message.match(/^Role: (BUYER|JASTIPER|ADMIN)$/m)?.[1];
  const issuedAtLine = message.match(/^Issued At: (.+)$/m)?.[1];

  if (!message.startsWith(LOGIN_MESSAGE_TITLE)) return false;
  if (walletLine !== normalizedWallet || roleLine !== role || !issuedAtLine) return false;

  const issuedAt = Date.parse(issuedAtLine);
  if (!Number.isFinite(issuedAt)) return false;
  if (Math.abs(Date.now() - issuedAt) > LOGIN_MESSAGE_TTL_MS) return false;

  try {
    return verifyMessage(message, signature).toLowerCase() === normalizedWallet;
  } catch {
    return false;
  }
}
