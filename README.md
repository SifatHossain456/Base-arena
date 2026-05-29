# Base Arena — On-Chain Prediction Tournaments

Compete in on-chain prediction tournaments on Base mainnet. Create arenas, stake ETH, predict asset price direction, and win prize pools — resolved by Chainlink oracles.

## Features

- **Browse Arenas** — Search and filter active tournaments by asset, status, and entry fee
- **Create Tournament** — Deploy a prediction arena with custom asset, duration, max participants, and prize contribution
- **Leaderboard** — On-chain rankings with win rate and total winnings per wallet
- **Profile** — Per-wallet stats: tournaments entered, won, total staked, and win rate
- **Live prices** — ETH, BTC, AERO prices via Chainlink feeds on Base

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Web3 | wagmi v2 + viem + RainbowKit |
| Wallets | MetaMask, Coinbase Wallet, WalletConnect |
| Smart Contracts | Solidity (on Base Mainnet) |
| Oracles | Chainlink price feeds |
| Network | Base Mainnet (Chain ID: 8453) |

## Getting Started

```bash
git clone https://github.com/SifatHossain456/base-arena.git
cd base-arena
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Smart Contracts

The arena contracts are deployed on Base Mainnet. Contract addresses are in `src/lib/contracts.ts`.

- **BaseArena.sol** — Tournament lifecycle: create, join, resolve via Chainlink oracle
- **ArenaNFT.sol** — On-chain SVG trophy NFTs (Gold/Silver/Bronze) awarded to top 3 winners

## Project Structure

```
src/app/
├── page.tsx           # Hero + featured arenas
├── arena/             # Browse + search tournaments
├── create/            # Create new tournament
├── leaderboard/       # On-chain rankings
└── profile/           # Wallet stats page
src/lib/
├── contracts.ts       # ABI + contract addresses
└── wagmi.ts           # Wallet configuration
```

## License

MIT
