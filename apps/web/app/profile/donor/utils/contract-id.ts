/**
 * Gets the POD NFT mint authority public key from environment variables.
 */
export function getPodNftMintAuthority(): string | null {
  return (
    process.env.POD_NFT_MINT_AUTHORITY_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_POD_NFT_MINT_AUTHORITY ||
    null
  );
}
