"use client";

import { useReadContracts } from "wagmi";
import { erc1155Abi } from "@/lib/abi/erc1155";
import type { Address } from "viem";

export function useERC1155Balances(
  contractAddress: Address | undefined,
  account: Address | undefined,
  tokenIds: bigint[]
) {
  const contracts = tokenIds.map((tokenId) => ({
    address: contractAddress,
    abi: erc1155Abi,
    functionName: "balanceOf" as const,
    args: [account!, tokenId] as const,
  }));

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: contractAddress && account ? contracts : [],
    query: {
      enabled: !!contractAddress && !!account && tokenIds.length > 0,
    },
  });

  const balances = data?.map((result, index) => ({
    tokenId: tokenIds[index],
    balance: result.status === "success" ? (result.result as bigint) : BigInt(0),
  }));

  return {
    balances,
    isLoading,
    error,
    refetch,
  };
}
