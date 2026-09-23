import "dotenv/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, Umi } from "@metaplex-foundation/umi";
import bs58 from "bs58";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Shared Umi instance: RPC connection + wallet identity. */
export function loadUmi(): Umi {
  const umi = createUmi(required("SOLANA_RPC_URL"));
  const secretKey = bs58.decode(required("WALLET_SECRET_KEY"));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return umi.use(keypairIdentity(keypair));
}

export const config = {
  collectionName: process.env.COLLECTION_NAME ?? "My Collection",
  collectionSymbol: process.env.COLLECTION_SYMBOL ?? "MYC",
  collectionDescription:
    process.env.COLLECTION_DESCRIPTION ?? "A professional NFT collection.",
  mintPriceSol: Number(process.env.MINT_PRICE_SOL ?? "0.1"),
  mintStartDate: process.env.MINT_START_DATE ?? "2026-10-01T00:00:00Z",
  collectionMint: process.env.COLLECTION_MINT,
  candyMachineId: process.env.CANDY_MACHINE_ID,
};
