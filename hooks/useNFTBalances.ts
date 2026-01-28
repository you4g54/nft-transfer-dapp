"use client";

import { useReadContracts } from "wagmi";
import { erc1155Abi } from "@/lib/abi/erc1155";
import { erc721Abi } from "@/lib/abi/erc721";
import type { Address } from "viem";
import type { ContractType } from "./useContractType";

export function useNFTBalances(
  contractAddress: Address | undefined,
  account: Address | undefined,
  tokenIds: bigint[],
  contractType: ContractType
) {
  // For ERC1155: use balanceOf(address, tokenId)
  const erc1155Contracts = tokenIds.map((tokenId) => ({
    address: contractAddress,
    abi: erc1155Abi,
    functionName: "balanceOf" as const,
    args: [account!, tokenId] as const,
  }));

  // For ERC721: use ownerOf(tokenId) and compare with account
  const erc721Contracts = tokenIds.map((tokenId) => ({
    address: contractAddress,
    abi: erc721Abi,
    functionName: "ownerOf" as const,
    args: [tokenId] as const,
  }));

  const contracts =
    contractType === "ERC1155"
      ? erc1155Contracts
      : contractType === "ERC721"
      ? erc721Contracts
      : [];

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: contractAddress && account && tokenIds.length > 0 ? contracts : [],
    query: {
      enabled:
        !!contractAddress &&
        !!account &&
        tokenIds.length > 0 &&
        (contractType === "ERC721" || contractType === "ERC1155"),
    },
  });

  const balances = data?.map((result, index) => {
    const tokenId = tokenIds[index];

    if (contractType === "ERC1155") {
      return {
        tokenId,
        balance: result.status === "success" ? (result.result as bigint) : BigInt(0),
        isOwner: result.status === "success" && (result.result as bigint) > BigInt(0),
      };
    } else {
      // ERC721: check if owner matches account
      const owner = result.status === "success" ? (result.result as Address) : undefined;
      const isOwner = owner?.toLowerCase() === account?.toLowerCase();
      return {
        tokenId,
        balance: isOwner ? BigInt(1) : BigInt(0),
        isOwner,
        owner,
      };
    }
  });

  return {
    balances,
    isLoading,
    error,
    refetch,
  };
}
