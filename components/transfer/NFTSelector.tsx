"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useNFTBalances } from "@/hooks/useNFTBalances";
import { isValidAddress, shortenAddress } from "@/lib/utils";
import type { Address } from "viem";
import type { ContractType } from "@/hooks/useContractType";

interface NFTSelectorProps {
  contractAddress: string;
  onSelect: (tokenId: string, balance: string) => void;
  contractType?: ContractType;
}

export function NFTSelector({ contractAddress, onSelect, contractType = "unknown" }: NFTSelectorProps) {
  const { address } = useAccount();
  const [tokenIdInput, setTokenIdInput] = useState("");
  const [tokenIdsToCheck, setTokenIdsToCheck] = useState<bigint[]>([]);

  const validAddress = isValidAddress(contractAddress)
    ? (contractAddress as Address)
    : undefined;

  const { balances, isLoading, refetch } = useNFTBalances(
    validAddress,
    address,
    tokenIdsToCheck,
    contractType
  );

  const handleAddTokenId = () => {
    const id = tokenIdInput.trim();
    if (id && !isNaN(Number(id))) {
      const newTokenId = BigInt(id);
      if (!tokenIdsToCheck.some((t) => t === newTokenId)) {
        setTokenIdsToCheck([...tokenIdsToCheck, newTokenId]);
      }
      setTokenIdInput("");
    }
  };

  const handleRemoveTokenId = (tokenId: bigint) => {
    setTokenIdsToCheck(tokenIdsToCheck.filter((t) => t !== tokenId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTokenId();
    }
  };

  if (!isValidAddress(contractAddress)) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter a valid contract address to view your NFTs
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Token ID Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={tokenIdInput}
          onChange={(e) => setTokenIdInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Token ID to check"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <button
          type="button"
          onClick={handleAddTokenId}
          className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
        >
          Check
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <svg className="h-5 w-5 animate-spin text-yellow-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Results */}
      {balances && balances.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Token Check Results
            </h4>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs text-yellow-600 hover:text-yellow-500"
            >
              Refresh
            </button>
          </div>
          <div className="grid gap-2">
            {balances.map(({ tokenId, balance, isOwner, owner }) => (
              <div
                key={tokenId.toString()}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  isOwner
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${
                      isOwner
                        ? "bg-gradient-to-br from-green-400 to-emerald-500"
                        : "bg-gradient-to-br from-zinc-400 to-zinc-500"
                    }`}
                  >
                    #{tokenId.toString().slice(0, 3)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Token #{tokenId.toString()}
                    </p>
                    {contractType === "ERC721" ? (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {isOwner ? (
                          <span className="text-green-600 dark:text-green-400">You own this</span>
                        ) : owner ? (
                          <>Owner: {shortenAddress(owner as string)}</>
                        ) : (
                          "Token not found"
                        )}
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Balance: {balance.toString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => onSelect(tokenId.toString(), balance.toString())}
                      className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-yellow-400"
                    >
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveTokenId(tokenId)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tokenIdsToCheck.length === 0 && (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Enter token IDs to check ownership
        </p>
      )}
    </div>
  );
}
