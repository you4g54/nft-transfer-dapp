"use client";

interface TransferTabsProps {
  activeTab: "single" | "batch";
  onTabChange: (tab: "single" | "batch") => void;
}

export function TransferTabs({ activeTab, onTabChange }: TransferTabsProps) {
  return (
    <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-700 dark:bg-zinc-800">
      <button
        onClick={() => onTabChange("single")}
        className={`flex-1 rounded-md px-4 py-2.5 transition-colors ${
          activeTab === "single"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        <span className="block text-sm font-medium">Single</span>
        <span className="block text-xs opacity-70">One NFT</span>
      </button>
      <button
        onClick={() => onTabChange("batch")}
        className={`flex-1 rounded-md px-4 py-2.5 transition-colors ${
          activeTab === "batch"
            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
            : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        <span className="block text-sm font-medium">Multi</span>
        <span className="block text-xs opacity-70">Multiple NFTs</span>
      </button>
    </div>
  );
}
