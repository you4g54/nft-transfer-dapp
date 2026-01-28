"use client";

import { useState } from "react";
import { getBscScanUrl, shortenAddress } from "@/lib/utils";

interface TransferStatusProps {
  hash?: `0x${string}`;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  onReset: () => void;
}

export function TransferStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  error,
  onReset,
}: TransferStatusProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (hash) {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!hash && !isPending && !error) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      {isPending && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <svg className="h-5 w-5 animate-spin text-yellow-600 dark:text-yellow-400" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">Waiting for Confirmation</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Please confirm in your wallet...</p>
          </div>
        </div>
      )}

      {isConfirming && hash && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Transaction Submitted</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Waiting for blockchain confirmation...</p>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">TX Hash</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {shortenAddress(hash, 8)}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {copied ? (
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccess && hash && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-600 dark:text-green-400">Transfer Successful!</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Your NFT has been transferred</p>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Transaction Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Status</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Confirmed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">TX Hash</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    {shortenAddress(hash, 6)}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Network</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">BSC Testnet</span>
              </div>
            </div>
          </div>

          <a
            href={getBscScanUrl(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View on BscScan Explorer
          </a>

          <button
            onClick={onReset}
            className="w-full rounded-lg border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Make Another Transfer
          </button>
        </div>
      )}

      {error && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-red-600 dark:text-red-400">Transfer Failed</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {error.message.includes("insufficient") || error.message.includes("reverted")
                  ? "Insufficient token balance or invalid transfer"
                  : "Something went wrong"}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <p className="max-h-24 overflow-y-auto break-all text-xs text-red-600 dark:text-red-400">
              {error.message.length > 200
                ? `${error.message.substring(0, 200)}...`
                : error.message}
            </p>
          </div>

          <button
            onClick={onReset}
            className="w-full rounded-lg bg-zinc-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
