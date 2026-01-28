# NFT Transfer dApp

A modern, lightweight Next.js decentralized application for transferring ERC-721 and ERC-1155 NFTs across any EVM-compatible blockchain with automatic contract type detection.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Why This App?

I built this dApp because I couldn't find a simple, functional NFT transfer tool. Even MetaMask sometimes incorrectly identifies ERC-721 NFTs as ERC-1155, making transfers confusing. This app solves that by:

- **Automatic Detection**: Uses ERC-165 `supportsInterface` to correctly identify contract types
- **Simple & Functional**: No unnecessary complexity - just connect, select, and transfer
- **Multi-Chain Support**: Works with any EVM-compatible blockchain
- **Open Source**: Free to use, modify, and contribute

## Features

- **Dual Standard Support**: Transfer both ERC-721 and ERC-1155 NFTs
- **Automatic Contract Detection**: Correctly identifies ERC-721 vs ERC-1155 using ERC-165
- **Single Transfer**: Transfer one NFT at a time
- **Multi Transfer**:
  - ERC-1155: Native batch transfer in a single transaction
  - ERC-721: Sequential transfer with progress tracking
- **Multi-Chain**: Supports any EVM chain (Ethereum, BSC, Polygon, Arbitrum, etc.)
- **RainbowKit Integration**: Beautiful wallet connection UI with multiple wallet support
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works on desktop and mobile

## Supported Networks

This dApp works with any EVM-compatible blockchain:

- Ethereum Mainnet & Testnets (Sepolia, Goerli)
- BNB Smart Chain (BSC) Mainnet & Testnet
- Polygon (Matic) Mainnet & Mumbai
- Arbitrum One & Nova
- Optimism
- Avalanche C-Chain
- Base
- And many more...

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Web3**:
  - wagmi v3
  - viem
  - RainbowKit
- **State Management**: TanStack Query
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Web3 wallet (MetaMask, Rainbow, Coinbase Wallet, etc.)
- Native tokens for gas fees on your chosen network

### Installation

1. Clone the repository:
```bash
git clone https://github.com/recepoksuz/nft-transfer-dapp.git
cd nft-transfer-dapp
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Run the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

To add or modify supported networks, edit:
- `config/chains.ts` - Chain configuration
- `config/wagmi.ts` - Wagmi configuration

## Usage

### Single Transfer
1. Connect your wallet
2. Enter the NFT contract address
3. The app automatically detects if it's ERC-721 or ERC-1155
4. Enter a Token ID and check ownership
5. Enter recipient address
6. For ERC-1155, specify the amount
7. Click "Transfer"

### Multi Transfer
1. Connect your wallet
2. Enter the NFT contract address
3. Add multiple Token IDs to the transfer queue
4. Enter recipient address
5. Click "Transfer"
   - **ERC-1155**: All tokens transferred in one transaction
   - **ERC-721**: Tokens transferred sequentially (approve each in wallet)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── providers/
│   │   └── Web3Provider.tsx    # Wagmi + RainbowKit provider
│   ├── wallet/
│   │   ├── ConnectButton.tsx   # Wallet connection button
│   │   └── AccountInfo.tsx     # Connected account info
│   ├── transfer/
│   │   ├── SingleTransferForm.tsx  # Single NFT transfer
│   │   ├── BatchTransferForm.tsx   # Multi NFT transfer
│   │   ├── NFTSelector.tsx         # Token ownership checker
│   │   └── TransferStatus.tsx      # Transaction status
│   └── ui/
│       └── TransferTabs.tsx    # Tab navigation
├── hooks/
│   ├── useContractType.ts          # Contract type detection
│   ├── useERC721Transfer.ts        # ERC-721 single transfer
│   ├── useERC721MultiTransfer.ts   # ERC-721 sequential transfer
│   ├── useERC1155Transfer.ts       # ERC-1155 single transfer
│   ├── useERC1155BatchTransfer.ts  # ERC-1155 batch transfer
│   └── useNFTBalances.ts           # NFT balance/ownership check
├── lib/
│   ├── abi/
│   │   ├── erc721.ts       # ERC-721 ABI
│   │   └── erc1155.ts      # ERC-1155 ABI
│   └── utils.ts            # Utility functions
├── config/
│   ├── chains.ts           # Chain configuration
│   └── wagmi.ts            # Wagmi configuration
└── types/
    └── index.ts            # TypeScript types
```

## Contract Standards

### ERC-721
- Each token is unique (1 of 1)
- Transfer function: `safeTransferFrom(from, to, tokenId)`
- No native batch transfer (sequential transfers used)

### ERC-1155
- Multiple tokens per ID possible
- Single transfer: `safeTransferFrom(from, to, id, amount, data)`
- Batch transfer: `safeBatchTransferFrom(from, to, ids[], amounts[], data)`

## Scripts

```bash
bun dev      # Start development server
bun build    # Build for production
bun start    # Start production server
bun lint     # Run ESLint
```

## Author

**Recep Öksüz**

- GitHub: [@recepoksuz](https://github.com/recepoksuz)
- Twitter: [@RecepOksuz_](https://x.com/RecepOksuz_)
- LinkedIn: [Recep Öksüz](https://www.linkedin.com/in/recep-oksuz/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - TypeScript Interface for Ethereum
- [RainbowKit](https://www.rainbowkit.com/) - Wallet Connection UI
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
