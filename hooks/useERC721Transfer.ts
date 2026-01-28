"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc721Abi } from "@/lib/abi/erc721";
import type { Address } from "viem";

interface ERC721TransferParams {
  contractAddress: Address;
  to: Address;
  tokenId: bigint;
}

export function useERC721Transfer() {
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

  const transfer = (params: ERC721TransferParams, from: Address) => {
    writeContract({
      address: params.contractAddress,
      abi: erc721Abi,
      functionName: "safeTransferFrom",
      args: [from, params.to, params.tokenId],
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
