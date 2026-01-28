"use client";

import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { shortenAddress } from "@/lib/utils";

export function AccountInfo() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  if (!isConnected || !address) {
    return null;
  }

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)
    : "0";

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <h3 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        Connected Account
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Address</span>
          <span className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {shortenAddress(address, 6)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Network</span>
          <span className="text-sm text-zinc-900 dark:text-zinc-100">
            {chain?.name || "Unknown"}
          </span>
        </div>
        {balance && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Balance</span>
            <span className="text-sm text-zinc-900 dark:text-zinc-100">
              {formattedBalance} {balance.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
