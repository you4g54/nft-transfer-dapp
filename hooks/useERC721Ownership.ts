"use client";

import { useReadContract } from "wagmi";
import { erc721Abi } from "@/lib/abi/erc721";
import type { Address } from "viem";

export function useERC721Ownership(
  contractAddress: Address | undefined,
  tokenId: bigint | undefined
) {
  const { data: owner, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: erc721Abi,
    functionName: "ownerOf",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: {
      enabled: !!contractAddress && tokenId !== undefined,
    },
  });

  return {
    owner,
    isLoading,
    error,
    refetch,
  };
}

export function useERC721Balance(
  contractAddress: Address | undefined,
  account: Address | undefined
) {
  const { data: balance, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi: erc721Abi,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: {
      enabled: !!contractAddress && !!account,
    },
  });

  return {
    balance,
    isLoading,
    error,
    refetch,
  };
}
