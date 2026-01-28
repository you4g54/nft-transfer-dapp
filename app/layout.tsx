import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/components/providers/Web3Provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFT Transfer dApp | ERC-721 & ERC-1155 Transfer Tool",
  description: "Free, open-source dApp for transferring ERC-721 and ERC-1155 NFTs on any EVM blockchain. Automatic contract detection, batch transfers, and multi-chain support.",
  keywords: [
    "NFT transfer",
    "ERC-721",
    "ERC-1155",
    "NFT",
    "blockchain",
    "Ethereum",
    "BSC",
    "Polygon",
    "Web3",
    "dApp",
    "crypto",
    "NFT tool",
    "batch transfer",
    "multi-chain",
  ],
  authors: [{ name: "Recep Öksüz", url: "https://github.com/recepoksuz" }],
  creator: "Recep Öksüz",
  publisher: "Recep Öksüz",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "NFT Transfer dApp | ERC-721 & ERC-1155",
    description: "Free, open-source tool for transferring NFTs on any EVM blockchain with automatic contract detection.",
    siteName: "NFT Transfer dApp",
  },
  twitter: {
    card: "summary_large_image",
    title: "NFT Transfer dApp | ERC-721 & ERC-1155",
    description: "Free, open-source tool for transferring NFTs on any EVM blockchain.",
    creator: "@RecepOksuz_",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
