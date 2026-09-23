/**
 * Creates the collection NFT that every item in the drop verifies against.
 * Run: npm run collection:create
 * Then save the printed mint address as COLLECTION_MINT in .env.
 */
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { loadUmi, config } from "./config";

async function main() {
  const umi = loadUmi();
  const collectionMint = generateSigner(umi);

  const metadataUri = process.env.COLLECTION_METADATA_URI;
  if (!metadataUri) {
    throw new Error(
      "Set COLLECTION_METADATA_URI in .env (upload assets/collection.json first, e.g. via `npm run upload`)."
    );
  }

  await createNft(umi, {
    mint: collectionMint,
    name: config.collectionName,
    symbol: config.collectionSymbol,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(5, 2), // 5% royalties
    isCollection: true,
  }).sendAndConfirm(umi);

  console.log("Collection created:", collectionMint.publicKey.toString());
  console.log("Save this as COLLECTION_MINT in your .env");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
