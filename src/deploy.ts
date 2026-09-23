/**
 * Deploys a Candy Machine v3 for the collection with standard guards:
 * SOL payment, start date, and per-wallet mint limit.
 * Run: npm run deploy
 * Then save the printed address as CANDY_MACHINE_ID in .env.
 */
import {
  generateSigner,
  some,
  sol,
  dateTime,
} from "@metaplex-foundation/umi";
import {
  create,
  addConfigLines,
  setMintAuthority,
  fetchCandyMachine,
} from "@metaplex-foundation/mpl-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { loadUmi, config } from "./config";

const ITEMS = [
  { name: "My Collection #1", uri: "https://example.com/metadata/1.json" },
  { name: "My Collection #2", uri: "https://example.com/metadata/2.json" },
  // Add one entry per NFT. URIs come from `npm run upload`.
];

async function main() {
  const umi = loadUmi();
  if (!config.collectionMint) {
    throw new Error("Set COLLECTION_MINT in .env (run npm run collection:create first).");
  }

  const candyMachine = generateSigner(umi);

  await create(umi, {
    candyMachine,
    collectionMint: publicKey(config.collectionMint),
    collectionUpdateAuthority: umi.identity,
    tokenStandard: 0, // NonFungible
    sellerFeeBasisPoints: 500, // 5% royalties
    symbol: config.collectionSymbol,
    maxEditionSupply: 0,
    isMutable: true,
    creators: [{ address: umi.identity.publicKey, verified: true, percentageShare: 100 }],
    configLineSettings: some({
      prefixName: "",
      nameLength: 32,
      prefixUri: "",
      uriLength: 200,
      isSequential: false,
    }),
    guards: {
      solPayment: some({ lamports: sol(config.mintPriceSol).basisPoints, destination: umi.identity.publicKey }),
      startDate: some({ date: dateTime(config.mintStartDate) }),
      mintLimit: some({ id: 1, limit: 5 }),
    },
  }).sendAndConfirm(umi);

  await addConfigLines(umi, {
    candyMachine: candyMachine.publicKey,
    index: 0,
    configLines: ITEMS,
  }).sendAndConfirm(umi);

  // Hand mint authority to the candy machine so only it can mint.
  await setMintAuthority(umi, {
    candyMachine: candyMachine.publicKey,
    mintAuthority: candyMachine.publicKey,
  }).sendAndConfirm(umi);

  const cm = await fetchCandyMachine(umi, candyMachine.publicKey);
  console.log("Candy Machine deployed:", candyMachine.publicKey.toString());
  console.log("Items loaded:", cm.itemsLoaded);
  console.log("Save this as CANDY_MACHINE_ID in your .env");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
