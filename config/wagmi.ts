import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  sepolia,
  bscTestnet,
  polygonMumbai,
} from "./chains";

export const config = getDefaultConfig({
  appName: "NFT Transfer dApp",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [
    // Mainnets
    mainnet,
    bsc,
    polygon,
    arbitrum,
    optimism,
    base,
    // Testnets
    sepolia,
    bscTestnet,
    polygonMumbai,
  ],
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
