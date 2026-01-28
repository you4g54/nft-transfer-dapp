"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc1155Abi } from "@/lib/abi/erc1155";
import type { BatchTransferParams } from "@/types";
import type { Address } from "viem";

export function useERC1155BatchTransfer() {
  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const batchTransfer = (params: BatchTransferParams, from: Address) => {
    writeContract({
      address: params.contractAddress,
      abi: erc1155Abi,
      functionName: "safeBatchTransferFrom",
      args: [from, params.to, params.tokenIds, params.amounts, "0x" as `0x${string}`],
    });
  };

  const error = writeError || receiptError;

  return {
    batchTransfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
