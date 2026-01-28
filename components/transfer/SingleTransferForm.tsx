"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useERC1155Transfer } from "@/hooks/useERC1155Transfer";
import { useERC721Transfer } from "@/hooks/useERC721Transfer";
import { useContractType } from "@/hooks/useContractType";
import { TransferStatus } from "./TransferStatus";
import { NFTSelector } from "./NFTSelector";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { isValidAddress } from "@/lib/utils";
import type { Address } from "viem";

export function SingleTransferForm() {
  const { address, isConnected } = useAccount();

  // Form state - must be declared first
  const [contractAddress, setContractAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("1");
  const [maxAmount, setMaxAmount] = useState("");

  // Contract type detection
  const validContractAddress = isValidAddress(contractAddress) ? (contractAddress as Address) : undefined;
  const { contractType, isERC721, isERC1155, isLoading: isDetecting } = useContractType(validContractAddress);

  // Transfer hooks for both standards
  const erc1155Transfer = useERC1155Transfer();
  const erc721Transfer = useERC721Transfer();

  // Use the appropriate transfer based on contract type
  const activeTransfer = isERC721 ? erc721Transfer : erc1155Transfer;
  const { hash, isPending, isConfirming, isSuccess, error, reset } = activeTransfer;

  // For ERC-721, amount is always 1
  useEffect(() => {
    if (isERC721) {
      setAmount("1");
    }
  }, [isERC721]);

  const isFormValid =
    isValidAddress(contractAddress) &&
    isValidAddress(toAddress) &&
    tokenId.trim() !== "" &&
    (isERC721 || (amount.trim() !== "" && !isNaN(Number(amount)) && Number(amount) > 0)) &&
    !isNaN(Number(tokenId)) &&
    (contractType === "ERC721" || contractType === "ERC1155");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !isFormValid) return;

    if (isERC721) {
      await erc721Transfer.transfer(
        {
          contractAddress: contractAddress as Address,
          to: toAddress as Address,
          tokenId: BigInt(tokenId),
        },
        address
      );
    } else {
      await erc1155Transfer.transfer(
        {
          contractAddress: contractAddress as Address,
          to: toAddress as Address,
          tokenId: BigInt(tokenId),
          amount: BigInt(amount),
        },
        address
      );
    }
  };

  const handleReset = () => {
    reset();
    setContractAddress("");
    setToAddress("");
    setTokenId("");
    setAmount("1");
    setMaxAmount("");
  };

  const handleNFTSelect = (selectedTokenId: string, balance: string) => {
    setTokenId(selectedTokenId);
    setMaxAmount(balance);
    setAmount("1");
  };

  if (!isConnected) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Please connect your wallet to transfer NFTs
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Contract Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              disabled={isPending || isConfirming}
            />
            {isValidAddress(contractAddress) && (
              <div className="flex items-center">
                {isDetecting ? (
                  <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    Detecting...
                  </span>
                ) : contractType === "ERC721" ? (
                  <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    ERC-721
                  </span>
                ) : contractType === "ERC1155" ? (
                  <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    ERC-1155
                  </span>
                ) : (
                  <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Unknown
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {isValidAddress(contractAddress) && (contractType === "ERC721" || contractType === "ERC1155") && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h4 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Check Your NFTs
            </h4>
            <NFTSelector
              contractAddress={contractAddress}
              onSelect={handleNFTSelect}
              contractType={contractType}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Recipient Address
          </label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            disabled={isPending || isConfirming}
          />
        </div>

        {isERC721 ? (
          // ERC-721: Only Token ID, no amount (always 1)
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Token ID
            </label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              disabled={isPending || isConfirming}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              ERC-721 tokens are unique, so amount is always 1
            </p>
          </div>
        ) : (
          // ERC-1155: Token ID + Amount
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Token ID
              </label>
              <input
                type="text"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                disabled={isPending || isConfirming}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Amount {maxAmount && <span className="text-zinc-400">(max: {maxAmount})</span>}
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                disabled={isPending || isConfirming}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isPending || isConfirming || isDetecting}
          className="w-full rounded-lg bg-yellow-500 py-3 text-sm font-medium text-black transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending || isConfirming ? "Processing..." : `Transfer ${isERC721 ? "ERC-721" : "ERC-1155"} NFT`}
        </button>
      </form>

      <TransferStatus
        hash={hash}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        onReset={handleReset}
      />
    </div>
  );
}
