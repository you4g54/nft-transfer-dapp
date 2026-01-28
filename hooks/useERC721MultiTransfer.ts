"use client";

import { useState, useEffect, useCallback } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { erc721Abi } from "@/lib/abi/erc721";
import type { Address, Hash } from "viem";

export interface ERC721MultiTransferParams {
  contractAddress: Address;
  to: Address;
  tokenIds: bigint[];
}

interface TransferResult {
  tokenId: bigint;
  hash: Hash;
  status: "success" | "failed";
}

export function useERC721MultiTransfer() {
  // Transfer queue state
  const [queue, setQueue] = useState<bigint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [completedTransfers, setCompletedTransfers] = useState<TransferResult[]>([]);
  const [transferParams, setTransferParams] = useState<{
    contractAddress: Address;
    to: Address;
    from: Address;
  } | null>(null);

  // Wagmi hooks
  const {
    data: currentHash,
    writeContract,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: currentHash,
  });

  const error = writeError || receiptError;
  const currentTokenId = queue[currentIndex];
  const totalCount = queue.length;
  const isComplete = currentIndex >= totalCount && totalCount > 0;

  // Execute transfer for current token
  const executeCurrentTransfer = useCallback(() => {
    if (!transferParams || currentIndex >= queue.length) return;

    const tokenId = queue[currentIndex];
    writeContract({
      address: transferParams.contractAddress,
      abi: erc721Abi,
      functionName: "safeTransferFrom",
      args: [transferParams.from, transferParams.to, tokenId],
    });
  }, [transferParams, currentIndex, queue, writeContract]);

  // Start the multi-transfer process
  const startTransfer = useCallback(
    (params: ERC721MultiTransferParams, from: Address) => {
      if (params.tokenIds.length === 0) return;

      setQueue(params.tokenIds);
      setCurrentIndex(0);
      setIsTransferring(true);
      setCompletedTransfers([]);
      setTransferParams({
        contractAddress: params.contractAddress,
        to: params.to,
        from,
      });
    },
    []
  );

  // Auto-execute first transfer when params are set
  useEffect(() => {
    if (transferParams && isTransferring && currentIndex === 0 && queue.length > 0 && !currentHash && !isPending) {
      executeCurrentTransfer();
    }
  }, [transferParams, isTransferring, currentIndex, queue.length, currentHash, isPending, executeCurrentTransfer]);

  // Handle successful transfer - move to next
  useEffect(() => {
    if (isSuccess && currentHash && isTransferring) {
      // Record completed transfer
      const tokenId = queue[currentIndex];
      setCompletedTransfers((prev) => [
        ...prev,
        { tokenId, hash: currentHash, status: "success" },
      ]);

      // Move to next token
      const nextIndex = currentIndex + 1;
      if (nextIndex < queue.length) {
        setCurrentIndex(nextIndex);
        resetWrite();
      } else {
        // All transfers complete
        setIsTransferring(false);
      }
    }
  }, [isSuccess, currentHash, isTransferring, currentIndex, queue, resetWrite]);

  // Execute next transfer after state updates
  useEffect(() => {
    if (isTransferring && currentIndex > 0 && currentIndex < queue.length && !currentHash && !isPending) {
      executeCurrentTransfer();
    }
  }, [isTransferring, currentIndex, queue.length, currentHash, isPending, executeCurrentTransfer]);

  // Skip failed transfer and continue
  const skip = useCallback(() => {
    if (!isTransferring || error === null) return;

    const tokenId = queue[currentIndex];
    setCompletedTransfers((prev) => [
      ...prev,
      { tokenId, hash: "0x" as Hash, status: "failed" },
    ]);

    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentIndex(nextIndex);
      resetWrite();
    } else {
      setIsTransferring(false);
    }
  }, [isTransferring, error, currentIndex, queue, resetWrite]);

  // Retry failed transfer
  const retry = useCallback(() => {
    if (!isTransferring || error === null) return;
    resetWrite();
    // Small delay before retry
    setTimeout(() => {
      executeCurrentTransfer();
    }, 100);
  }, [isTransferring, error, resetWrite, executeCurrentTransfer]);

  // Reset everything
  const reset = useCallback(() => {
    setQueue([]);
    setCurrentIndex(0);
    setIsTransferring(false);
    setCompletedTransfers([]);
    setTransferParams(null);
    resetWrite();
  }, [resetWrite]);

  return {
    // Transfer control
    startTransfer,
    skip,
    retry,
    reset,

    // Queue state
    queue,
    currentIndex,
    totalCount,
    currentTokenId,

    // Transfer status
    isTransferring,
    isComplete,
    isPending,
    isConfirming,

    // Results
    currentHash,
    completedTransfers,

    // Error handling
    error,
    failedTokenId: error ? currentTokenId : undefined,
  };
}
