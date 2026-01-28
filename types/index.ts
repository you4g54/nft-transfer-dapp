import type { Address } from "viem";

export interface TransferParams {
  contractAddress: Address;
  to: Address;
  tokenId: bigint;
  amount: bigint;
}

export interface BatchTransferParams {
  contractAddress: Address;
  to: Address;
  tokenIds: bigint[];
  amounts: bigint[];
}

export interface TokenItem {
  id: string;
  tokenId: string;
  amount: string;
}

export type TransactionStatus = "idle" | "pending" | "success" | "error";
