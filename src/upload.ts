/**
 * Uploads images + metadata JSON and prints the resulting URIs.
 * Run: npm run upload -- ./assets/images
 *
 * Uses the Umi uploader (default: Irys/Arweave via umi-bundle-defaults).
 * For large collections, point this at your own storage and update
 * deploy.ts ITEMS with the returned URIs.
 */
import { readFile } from "fs/promises";
import { join } from "path";
import { createGenericFile } from "@metaplex-foundation/umi";
import { loadUmi } from "./config";

async function main() {
  const umi = loadUmi();
  const dir = process.argv[2];
  if (!dir) {
    throw new Error("Usage: npm run upload -- <directory of images>");
  }

  // Example: upload a single collection image.
  // Extend this loop for per-item images + generated metadata JSON.
  const imagePath = join(dir, "collection.png");
  const imageBuffer = await readFile(imagePath);
  const imageFile = createGenericFile(imageBuffer, "collection.png", {
    contentType: "image/png",
  });
  const [imageUri] = await umi.uploader.upload([imageFile]);
  console.log("Image URI:", imageUri);

  const metadata = {
    name: process.env.COLLECTION_NAME ?? "My Collection",
    symbol: process.env.COLLECTION_SYMBOL ?? "MYC",
    description:
      process.env.COLLECTION_DESCRIPTION ?? "A professional NFT collection.",
    image: imageUri,
  };
  const metadataUri = await umi.uploader.uploadJson(metadata);
  console.log("Metadata URI:", metadataUri);
  console.log("Save this as COLLECTION_METADATA_URI in your .env");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
