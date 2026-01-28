"use client";

import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract } from "wagmi";
import { erc1155Abi } from "@/lib/abi/erc1155";
import type { TransferParams } from "@/types";
import type { Address } from "viem";

export function useERC1155Transfer() {
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

  const transfer = (params: TransferParams, from: Address) => {
    writeContract({
      address: params.contractAddress,
      abi: erc1155Abi,
      functionName: "safeTransferFrom",
      args: [from, params.to, params.tokenId, params.amount, "0x" as `0x${string}`],
    });
  };

  const error = writeError || receiptError;

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
  };
}
