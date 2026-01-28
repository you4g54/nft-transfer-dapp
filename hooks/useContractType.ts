"use client";

import { useReadContracts } from "wagmi";
import { INTERFACE_IDS } from "@/lib/abi/erc721";
import type { Address } from "viem";

const supportsInterfaceAbi = [
  {
    inputs: [{ name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export type ContractType = "ERC721" | "ERC1155" | "unknown" | "loading";

export function useContractType(contractAddress: Address | undefined) {
  const { data, isLoading, error } = useReadContracts({
    contracts: contractAddress
      ? [
          {
            address: contractAddress,
            abi: supportsInterfaceAbi,
            functionName: "supportsInterface",
            args: [INTERFACE_IDS.ERC721],
          },
          {
            address: contractAddress,
            abi: supportsInterfaceAbi,
            functionName: "supportsInterface",
            args: [INTERFACE_IDS.ERC1155],
          },
        ]
      : [],
    query: {
      enabled: !!contractAddress,
    },
  });

  let contractType: ContractType = "unknown";

  if (isLoading) {
    contractType = "loading";
  } else if (data) {
    const isERC721 = data[0]?.status === "success" && data[0].result === true;
    const isERC1155 = data[1]?.status === "success" && data[1].result === true;

    if (isERC1155) {
      contractType = "ERC1155";
    } else if (isERC721) {
      contractType = "ERC721";
    }
  }

  return {
    contractType,
    isLoading,
    error,
    isERC721: contractType === "ERC721",
    isERC1155: contractType === "ERC1155",
  };
}
