/**
 * Mints one NFT from the configured Candy Machine to your wallet.
 * Run: npm run mint
 */
import { generateSigner, publicKey, transactionBuilder } from "@metaplex-foundation/umi";
import {
  mintV2,
  fetchCandyMachine,
  fetchCandyGuard,
} from "@metaplex-foundation/mpl-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { loadUmi, config } from "./config";

async function main() {
  const umi = loadUmi();
  if (!config.candyMachineId) {
    throw new Error("Set CANDY_MACHINE_ID in .env (run npm run deploy first).");
  }

  const candyMachinePublicKey = publicKey(config.candyMachineId);
  const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey);
  const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority);
  const nftMint = generateSigner(umi);

  await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      mintV2(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard.publicKey,
        nftMint,
        collectionMint: candyMachine.collectionMint,
        collectionUpdateAuthority: umi.identity.publicKey,
        mintArgs: {
          solPayment: { destination: umi.identity.publicKey },
          mintLimit: { id: 1 },
        },
      })
    )
    .sendAndConfirm(umi);

  console.log("Minted:", nftMint.publicKey.toString());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
