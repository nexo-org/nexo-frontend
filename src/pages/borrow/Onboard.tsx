import { AccountAddress, Aptos, AptosConfig, Network, type AnyRawTransaction } from "@aptos-labs/ts-sdk";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHaloWallet } from "@/hooks/useHaloWallet";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "loading" | "completed" | "error";
  error?: string;
}

export default function Onboard() {
  // Initialize Aptos client for testnet
  const aptos = useMemo(() => {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    return new Aptos(aptosConfig);
  }, []);

  const { walletData, isConnected, connectHaloCard, createHaloWallet } = useHaloWallet(aptos);

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "connect",
      title: "Connect HaLo Card",
      description: "Tap your HaLo card to the NFC reader",
      status: "pending",
    },
    {
      id: "generate",
      title: "Generate Wallet",
      description: "Derive Aptos wallet from your HaLo card",
      status: "pending",
    },
    {
      id: "display",
      title: "Wallet Ready",
      description: "Your Aptos wallet address is ready",
      status: "pending",
    },
  ]);

  const [signedTransaction, setSignedTransaction] = useState<string | null>(null);
  const [isSigningTransaction, setIsSigningTransaction] = useState(false);

  const updateStepStatus = useCallback((stepId: string, status: OnboardingStep["status"], error?: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, error } : step)));
  }, []);

  const handleConnectHaloCard = useCallback(async () => {
    updateStepStatus("connect", "loading");

    try {
      updateStepStatus("connect", "completed");
      updateStepStatus("generate", "loading");

      // Connect HaLo card using the improved hook
      await connectHaloCard(aptos);

      updateStepStatus("generate", "completed");
      updateStepStatus("display", "completed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      updateStepStatus("connect", "error", errorMessage);
      console.error("HaLo card connection failed:", error);
    }
  }, [updateStepStatus, connectHaloCard, aptos]);

  const signDummyTransaction = useCallback(async () => {
    if (!walletData?.address || !isConnected) {
      alert("Please connect your HaLo card first");
      return;
    }

    setIsSigningTransaction(true);

    try {
      const haloWallet = createHaloWallet();
      if (!haloWallet) {
        throw new Error("Failed to create HaloWallet instance");
      }

      // Create a dummy transaction (transfer 1 octa to self)
      const senderAddress = AccountAddress.fromString(walletData.address);

      // Build a simple transfer transaction
      const transaction = await aptos.transaction.build.simple({
        sender: senderAddress,
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [senderAddress, 1], // Transfer 1 octa (smallest unit)
        },
      }) as AnyRawTransaction;

      // Sign transaction with HaLo card using improved implementation
      const signature = await haloWallet.signTransaction(transaction);

      // Format the signed transaction for display
      const signedTxn = {
        transaction: {
          sender: senderAddress.toString(),
          type: "simple_transaction",
          function: "0x1::aptos_account::transfer",
          arguments: [senderAddress.toString(), "1"],
        },
        signature: signature.toString(),
        publicKey: walletData.publicKey,
        signerAddress: walletData.address,
      };

      setSignedTransaction(JSON.stringify(signedTxn, null, 2));
      console.log("Signed transaction:", signedTxn);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Transaction signing failed";
      alert(`Transaction signing failed: ${errorMessage}`);
      console.error("Transaction signing error:", error);
    } finally {
      setIsSigningTransaction(false);
    }
  }, [walletData, isConnected, createHaloWallet, aptos]);

  const getStepIcon = (status: OnboardingStep["status"]) => {
    switch (status) {
      case "completed":
        return "✅";
      case "loading":
        return "⏳";
      case "error":
        return "❌";
      default:
        return "⭕";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Create Your Aptos Wallet</h1>
        <p className="text-lg text-gray-600">Use your Arx HaLo chip to securely create and manage your Aptos wallet</p>
      </div>

      {/* Onboarding Steps */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Setup Process</h2>
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center space-x-4 p-4 rounded-lg border",
                step.status === "completed" && "bg-green-50 border-green-200",
                step.status === "loading" && "bg-blue-50 border-blue-200",
                step.status === "error" && "bg-red-50 border-red-200",
                step.status === "pending" && "bg-gray-50 border-gray-200"
              )}
            >
              <div className="text-2xl">{getStepIcon(step.status)}</div>
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
                {step.error && <p className="text-sm text-red-600 mt-1">Error: {step.error}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Button */}
      {!isConnected && (
        <div className="text-center">
          <Button onClick={handleConnectHaloCard} disabled={steps[0].status === "loading"} size="lg" className="px-8">
            {steps[0].status === "loading" ? "Connecting..." : "Connect HaLo Card"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Make sure NFC is enabled and place your HaLo card near the reader
          </p>
        </div>
      )}

      {/* Wallet Information */}
      {isConnected && walletData && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">🎉 Your Aptos Wallet</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Public Key</label>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">{walletData.publicKey}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wallet Address</label>
                <div className="font-mono text-sm bg-white p-3 rounded border break-all">{walletData.address}</div>
              </div>
            </div>
          </div>

          {/* Transaction Signing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Test Transaction Signing</h2>
            <p className="text-gray-600">Test your wallet by signing a dummy transaction with your HaLo card</p>

            <Button onClick={signDummyTransaction} disabled={isSigningTransaction} variant="outline" size="lg">
              {isSigningTransaction ? "Signing Transaction..." : "Sign Dummy Transaction"}
            </Button>

            {signedTransaction && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600">Signed Transaction</label>
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">{signedTransaction}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Information */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-3">How It Works</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>HaLo card detection uses WebNFC API to communicate with the Arx HaLo chip</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>secp256k1 public key is retrieved from the card's secure element</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Aptos authentication key and account address are derived using proper cryptographic methods</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Transactions are signed using the HaLo card's private key, which never leaves the secure element</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">5.</span>
            <span>Signed transactions can be submitted to the Aptos blockchain for execution</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">6.</span>
            <span>HaloAptosWallet class provides a secure interface for all wallet operations</span>
          </div>
        </div>
      </div>
    </div>
  );
}