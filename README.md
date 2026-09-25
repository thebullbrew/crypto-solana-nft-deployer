# Solana NFT Deployer

![banner](assets/banner.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Devnet%20%7C%20Mainnet-9945FF.svg)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org)

A professional, script-driven toolkit for deploying NFT collections to Solana — from collection setup and metadata management to Candy Machine launches and minting. Built on [Metaplex Umi](https://developers.metaplex.com/umi) and [mpl-candy-machine](https://developers.metaplex.com/candy-machine).

## Features

- **Collection NFT creation** — mint a verified on-chain collection with Metaplex Token Metadata
- **Candy Machine v3 deployment** — configure guards (SOL payment, start date, mint limits, allow lists) and launch
- **Metadata templates** — validated JSON templates for collection and item metadata
- **Mint scripts** — mint from your Candy Machine with a single command
- **Devnet-first workflow** — test everything on devnet before touching mainnet
- **CI** — GitHub Actions checks TypeScript compilation on every push

## Prerequisites

- Node.js 18+
- A Solana wallet keypair (devnet SOL from the [faucet](https://faucet.solana.com))
- RPC endpoint (Helius, QuickNode, or public)

## Quickstart

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env: set SOLANA_RPC_URL and WALLET_SECRET_KEY

# 3. Create your collection NFT (devnet first!)
npm run collection:create

# 4. Deploy the Candy Machine
npm run deploy

# 5. Mint
npm run mint
```

> ⚠️ **Always test on devnet first.** Set `SOLANA_RPC_URL=https://api.devnet.solana.com` and airdrop devnet SOL before running against mainnet.

## Project structure

```
├── src/
│   ├── config.ts       # Umi setup, wallet, and RPC configuration
│   ├── collection.ts   # Create the collection NFT
│   ├── deploy.ts       # Deploy Candy Machine + insert items
│   ├── mint.ts         # Mint an NFT from the Candy Machine
│   └── upload.ts       # Upload metadata/images (Arweave via Umi uploader)
├── assets/
│   ├── collection.json # Collection metadata template
│   └── example-item.json # Item metadata template
├── .env.example        # Required environment variables
└── .github/workflows/ci.yml
```

## Usage

### 1. Create a collection

```bash
npm run collection:create
```

Creates a collection NFT and prints its mint address. Save it as `COLLECTION_MINT` in `.env`.

### 2. Deploy the Candy Machine

```bash
npm run deploy
```

Creates a Candy Machine v3 with guards from your config, inserts items from `assets/`, and prints the Candy Machine ID. Save it as `CANDY_MACHINE_ID` in `.env`.

### 3. Mint

```bash
npm run mint
```

Mints one NFT from the configured Candy Machine to your wallet.

## Configuration

| Variable | Description |
|---|---|
| `SOLANA_RPC_URL` | RPC endpoint (devnet for testing, mainnet for launch) |
| `WALLET_SECRET_KEY` | Base58-encoded secret key of the authority wallet |
| `COLLECTION_MINT` | Mint address of your collection NFT |
| `CANDY_MACHINE_ID` | Candy Machine address after deployment |
| `COLLECTION_NAME` | Collection display name |
| `COLLECTION_SYMBOL` | Collection symbol |
| `MINT_PRICE_SOL` | Price per mint in SOL |
| `MINT_START_DATE` | ISO date when minting opens |

## Security

- **Never commit `.env`** — it holds your wallet secret key. Use a dedicated deployer wallet, never your main wallet.
- Review guard configuration on devnet before mainnet.
- Verify Candy Machine settings on-chain before announcing a mint.

## Roadmap

- [ ] Allow-list / merkle-tree guard support
- [ ] Hidden settings for large collections
- [ ] Frontend mint button component
- [ ] Royalty enforcement via programmable NFTs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
