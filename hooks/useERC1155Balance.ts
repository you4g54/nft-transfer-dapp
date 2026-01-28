"use client";

import { useReadContract } from "wagmi";
import { erc1155Abi } from "@/lib/abi/erc1155";
import type { Address } from "viem";

export function useERC1155Balance(
  contractAddress: Address | undefined,
  account: Address | undefined,
  tokenId: bigint | undefined
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: erc1155Abi,
    functionName: "balanceOf",
    args: account && tokenId !== undefined ? [account, tokenId] : undefined,
    query: {
      enabled: !!contractAddress && !!account && tokenId !== undefined,
    },
  });

  return {
    balance: data,
    isLoading,
    error,
    refetch,
  };
}
