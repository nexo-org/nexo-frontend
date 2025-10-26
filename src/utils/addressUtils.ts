/**
 * Clean address by removing double 0x prefix and ensuring proper format
 * Works for both Ethereum and Aptos addresses
 */
export function cleanAddress(address: string): string {
  if (!address) return address;

  // Remove double 0x prefix if it exists
  if (address.startsWith("0x0x")) {
    return address.slice(2);
  }

  // Ensure single 0x prefix
  if (!address.startsWith("0x")) {
    return `0x${address}`;
  }

  return address;
}

/**
 * Validates if an address has the correct format
 * @param address The address to validate
 * @returns True if the address format is valid
 */
export function isValidAddressFormat(address: string): boolean {
  if (!address) return false;

  // Check if it starts with 0x and has correct length (42 characters for Ethereum, up to 66 for Aptos)
  const cleanAddr = cleanAddress(address);
  return cleanAddr.startsWith("0x") && (cleanAddr.length === 42 || cleanAddr.length <= 66);
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/^0x/, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}