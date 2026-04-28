import type { AppRole } from "./demoProfiles";
import { buildWalletLoginMessage } from "./walletAuth";

type Eip1193Provider = {
  request<T = unknown>(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<T>;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

function getInjectedWallet() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Wallet belum terdeteksi. Install atau aktifkan MetaMask/Rabby dulu.");
  }

  return window.ethereum;
}

export async function connectInjectedWallet({ forceAccountSelection = false } = {}) {
  const ethereum = getInjectedWallet();

  if (forceAccountSelection) {
    try {
      await ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;
      if (code === 4001) throw new Error("Pemilihan wallet dibatalkan.");
    }
  }

  const accounts = await ethereum.request<string[]>({ method: "eth_requestAccounts" });
  const address = accounts[0];
  if (!address) throw new Error("Tidak ada wallet yang dipilih.");
  return address;
}

export async function signWalletLogin(walletAddress: string, role: AppRole) {
  const ethereum = getInjectedWallet();
  const issuedAt = new Date().toISOString();
  const message = buildWalletLoginMessage({ walletAddress, role, issuedAt });

  const signature = await ethereum.request<string>({
    method: "personal_sign",
    params: [message, walletAddress]
  });

  return { message, signature };
}
