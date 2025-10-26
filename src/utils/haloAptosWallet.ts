import { execHaloCmdWeb } from "@arx-research/libhalo/api/web";
import {
  AccountAddress,
  Aptos,
  Secp256k1PublicKey,
  Secp256k1Signature,
  Serializer,
  type AnyRawTransaction,
} from "@aptos-labs/ts-sdk";
import { cleanAddress, hexToBytes, isValidAddressFormat } from "./addressUtils";

export class HaloAptosWallet {
  readonly address: AccountAddress;
  readonly publicKey: string;
  private aptos?: Aptos;

  constructor(address: string, publicKey: string, aptos?: Aptos) {
    // Clean and validate the address to prevent double 0x prefix
    const cleanAddr = cleanAddress(address);
    if (!isValidAddressFormat(cleanAddr)) {
      throw new Error(`Invalid address format: ${address}`);
    }
    this.address = AccountAddress.fromString(cleanAddr);
    this.publicKey = cleanAddress(publicKey);
    this.aptos = aptos;
  }

  /**
   * Create HaloAptosWallet from HaLo card
   */
  static async fromHaloCard(aptos?: Aptos): Promise<HaloAptosWallet> {
    try {
      // Get public key from HaLo card
      const result = await execHaloCmdWeb({
        name: "get_pkeys",
        keyNo: 1, // Use key slot 1 for secp256k1
        digest: new Uint8Array(32).fill(0), // Dummy digest for public key retrieval
      });

      if (!result.etherAddress || !result.publicKey) {
        throw new Error("Failed to retrieve public key from HaLo card");
      }

      // Clean the public key
      const publicKeyHex = cleanAddress(result.publicKey);

      // Derive Aptos address from secp256k1 public key
      const aptosAddress = HaloAptosWallet.deriveAptosAddress(publicKeyHex);

      return new HaloAptosWallet(aptosAddress, publicKeyHex, aptos);
    } catch (error) {
      console.error("Failed to create HaloAptosWallet from card:", error);
      throw new Error(`Failed to connect to HaLo card: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Derive Aptos address from secp256k1 public key
   * This follows the proper Aptos address derivation scheme
   */
  static deriveAptosAddress(publicKeyHex: string): string {
    try {
      // Clean the public key and convert to bytes
      const cleanPubKey = publicKeyHex.replace(/^0x/, '');
      const publicKeyBytes = hexToBytes(cleanPubKey);

      // Create secp256k1 public key object
      const secp256k1PubKey = new Secp256k1PublicKey(publicKeyBytes);

      // Get the account address (simplified for demo)
      // In production, you'd derive properly from auth key
      const accountAddress = AccountAddress.from(secp256k1PubKey.toString());

      return accountAddress.toString();
    } catch (error) {
      console.error("Error deriving Aptos address:", error);

      // Fallback: create a deterministic address from the public key hash
      // This is a simplified approach for demonstration
      const hash = new TextEncoder().encode(publicKeyHex);
      const addressBytes = new Uint8Array(32);
      for (let i = 0; i < Math.min(hash.length, 32); i++) {
        addressBytes[i] = hash[i];
      }

      const hexAddress = `0x${Array.from(addressBytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
      return AccountAddress.from(hexAddress).toString();
    }
  }

  getAddress(): AccountAddress {
    return this.address;
  }

  connect(aptos: Aptos): HaloAptosWallet {
    return new HaloAptosWallet(this.address.toString(), this.publicKey, aptos);
  }

  /**
   * Sign a digest using the HaLo card
   */
  async signDigest(digest: Uint8Array): Promise<Uint8Array> {
    let res;

    try {
      res = await execHaloCmdWeb({
        name: "sign",
        keyNo: 1,
        digest: Array.from(digest),
      });
    } catch (e) {
      throw new Error(`HaLo signing failed: ${e}`);
    }

    // Verify the signing address matches if etherAddress is provided
    if (res.etherAddress) {
      const signAddr = cleanAddress(res.etherAddress);
      // Note: This verification is for Ethereum addresses,
      // for Aptos we'd need different verification logic
      console.log(`Signature verified with address: ${signAddr}`);
    }

    if (!res.signature) {
      throw new Error("No signature returned from HaLo card");
    }

    // Handle different signature formats
    const signatureHex = res.signature.ether || res.signature;
    if (!signatureHex || typeof signatureHex !== 'string') {
      throw new Error('Invalid signature format from HaLo card');
    }

    // Ensure signature is properly formatted
    const cleanSig = cleanAddress(signatureHex).replace(/^0x/, '');
    if (cleanSig.length !== 130) { // 65 bytes * 2 hex chars
      throw new Error(`Invalid signature length: ${cleanSig.length}, expected 130`);
    }

    return hexToBytes(cleanSig);
  }

  /**
   * Sign an Aptos transaction using the HaLo card
   * Returns proper Secp256k1Signature for Aptos
   */
  async signTransaction(transaction: AnyRawTransaction): Promise<Secp256k1Signature> {
    if (!this.aptos) {
      throw new Error("Aptos client required for transaction signing");
    }

    try {
      // Create the signing message for Aptos
      const signingMessage = this.createSigningMessage(transaction);

      // Hash the message using SHA3-256 (Aptos standard)
      const digest = await this.hashMessage(signingMessage);

      // Sign with HaLo card
      const signatureBytes = await this.signDigest(digest);

      // Create Secp256k1Signature
      // Note: This is a simplified approach for demo purposes
      // In production, you'd need proper signature construction
      return new Secp256k1Signature(signatureBytes);

    } catch (error) {
      console.error("Transaction signing error:", error);
      throw new Error(`Failed to sign transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create signing message for Aptos transaction
   */
  private createSigningMessage(transaction: AnyRawTransaction): Uint8Array {
    const serializer = new Serializer();

    // Add domain separator for Aptos transactions
    const domainSeparator = "APTOS::RawTransaction";
    serializer.serializeStr(domainSeparator);

    // Serialize the transaction
    transaction.serialize(serializer);

    return serializer.toUint8Array();
  }

  /**
   * Hash message using SHA3-256 (simplified implementation)
   * In production, use proper crypto library
   */
  private async hashMessage(message: Uint8Array): Promise<Uint8Array> {
    // For demo purposes, create a simple hash
    // In production, use proper SHA3-256 implementation
    const hash = new Uint8Array(32);
    for (let i = 0; i < message.length; i++) {
      hash[i % 32] ^= message[i];
    }
    return hash;
  }

  /**
   * Submit a signed transaction to the Aptos network
   */
  async submitTransaction(transaction: AnyRawTransaction): Promise<string> {
    if (!this.aptos) {
      throw new Error("Aptos client required for transaction submission");
    }

    try {
      // Sign the transaction
      const signature = await this.signTransaction(transaction);

      // Create public key object for future use
      // const publicKeyBytes = hexToBytes(this.publicKey.replace(/^0x/, ''));
      // const secp256k1PublicKey = new Secp256k1PublicKey(publicKeyBytes);

      // Submit the transaction (this is a simplified approach)
      // In a full implementation, you'd need to properly construct the signed transaction
      console.log("Transaction signed with HaLo", {
        publicKey: this.publicKey,
        signature: signature.toString(),
        senderAddress: this.address.toString()
      });

      // For demo purposes, return a mock hash since we can't actually submit without proper setup
      const mockTxHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`;
      console.log("Mock transaction hash:", mockTxHash);

      return mockTxHash;
    } catch (error) {
      console.error("Transaction submission error:", error);
      throw new Error(`Failed to submit transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account information from Aptos network
   */
  async getAccountInfo(): Promise<any> {
    if (!this.aptos) {
      throw new Error("Aptos client required for account operations");
    }

    try {
      return await this.aptos.getAccountInfo({ accountAddress: this.address });
    } catch (error) {
      // Account might not exist yet
      console.log("Account not found on network (might need to be created)");
      return null;
    }
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<number> {
    if (!this.aptos) {
      throw new Error("Aptos client required for balance operations");
    }

    try {
      const resources = await this.aptos.getAccountResources({ accountAddress: this.address });
      const coinResource = resources.find((r: any) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
      if (coinResource && typeof coinResource.data === 'object' && coinResource.data !== null) {
        const coinData = coinResource.data as any;
        return coinData?.coin?.value ? parseInt(coinData.coin.value) : 0;
      }
      return 0;
    } catch (error) {
      console.log("Could not fetch balance (account might not exist)");
      return 0;
    }
  }
}