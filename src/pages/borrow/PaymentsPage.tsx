import { Scanner } from "@yudiel/react-qr-scanner";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Info,
  Loader,
  Lock,
  Scan,
  Send,
  Shield,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingOrbs } from "../../components/FloatingOrbs";
import { GlowingButton } from "../../components/GlowingButton";
import { WalletSelector } from "../../components/WalletSelector";

type CreditSummaryBannerProps = {
  creditLimit: number;
  availableCredit: number;
  outstandingDebt: number;
};

const VirtualCreditCard = ({
  creditLimit,
  availableCredit,
  outstandingDebt,
  userAddress,
  isProcessing = false,
}: CreditSummaryBannerProps & {
  userAddress: string;
  isProcessing?: boolean;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPaymentEffect, setShowPaymentEffect] = useState(false);
  const usagePercentage = ((creditLimit - availableCredit) / creditLimit) * 100;

  const cardNumber = userAddress
    ? `4532 ${userAddress.slice(2, 6).toUpperCase()} ${userAddress.slice(6, 10).toUpperCase()} ${userAddress.slice(-4).toUpperCase()}`
    : "4532 •••• •••• ••••";

  React.useEffect(() => {
    if (isProcessing) {
      setShowPaymentEffect(true);
      setIsFlipped(true);

      const timer = setTimeout(() => {
        setShowPaymentEffect(false);
        setIsFlipped(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="perspective-1000 mb-8"
    >
      <motion.div
        className="relative w-full max-w-md mx-auto"
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isProcessing ? 1.1 : 1,
          rotateX: isProcessing ? 5 : 0,
        }}
        whileHover={{
          rotateY: !isProcessing && showDetails ? 180 : !isProcessing ? 5 : 0,
          scale: !isProcessing ? 1.05 : 1.1,
        }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Credit Card Front */}
        <motion.div
          className={`relative w-full h-56 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 text-white ${
            isFlipped ? "backface-hidden" : ""
          }`}
          animate={{
            boxShadow: isProcessing
              ? [
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                  "0 25px 50px -12px rgba(251, 146, 60, 0.3)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
                ]
              : "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          }}
          transition={{
            boxShadow: { duration: 1.5, repeat: isProcessing ? Infinity : 0 },
          }}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Payment Wave Effect */}
          <AnimatePresence>
            {showPaymentEffect && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ scale: 3, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border-4 border-green-400/60"
              />
            )}
          </AnimatePresence>

          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-600/5 rounded-2xl overflow-hidden">
            <div className="absolute top-4 right-4 w-16 h-16 border border-white/5 rounded-full"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border border-white/8 rounded-full"></div>

            {/* Subtle pattern lines */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
              <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
            </div>

            {/* Animated particles during payment */}
            <AnimatePresence>
              {isProcessing &&
                [...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                      x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                      y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="absolute w-2 h-2 bg-amber-400/80 rounded-full"
                  />
                ))}
            </AnimatePresence>
          </div>

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={isProcessing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
                >
                  <Zap className="w-6 h-6 text-amber-400" />
                </motion.div>
                <span className="font-bold text-lg text-white">Nexo</span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 rounded-full hover:bg-white/5 transition-colors backdrop-blur-sm"
                disabled={isProcessing}
              >
                {showDetails ? <EyeOff className="w-4 h-4 text-white/70" /> : <Eye className="w-4 h-4 text-white/70" />}
              </button>
            </div>

            <div className="space-y-4">
              <motion.div
                className="text-xl font-mono tracking-wider text-white/95"
                animate={
                  isProcessing
                    ? {
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 10px rgba(251, 191, 36, 0.6)",
                          "0 0 0px rgba(255,255,255,0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
              >
                {showDetails ? cardNumber : cardNumber.replace(/\d(?=\d{4})/g, "•")}
              </motion.div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">Available Credit</div>
                  <motion.div
                    className="text-2xl font-bold text-white"
                    animate={isProcessing ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
                  >
                    ${availableCredit.toLocaleString()}
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60 uppercase tracking-wide">Expires</div>
                  <div className="font-mono text-white/90">12/28</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chip with subtle glow effect */}
          <motion.div
            className="absolute top-16 left-6 w-10 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md shadow-xl"
            animate={
              isProcessing
                ? {
                    boxShadow: [
                      "0 0 0px rgba(251, 191, 36, 0)",
                      "0 0 15px rgba(251, 191, 36, 0.4)",
                      "0 0 0px rgba(251, 191, 36, 0)",
                    ],
                  }
                : {
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  }
            }
            transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
          />

          {/* Contactless symbol with animation */}
          <div className="absolute top-16 right-20">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 border-2 border-white/40 rounded-full ${i > 0 ? "opacity-20" : ""}`}
                  animate={
                    isProcessing
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.8,
                    repeat: isProcessing ? Infinity : 0,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credit Card Back (for flip effect) */}
        <motion.div
          className={`absolute inset-0 w-full h-56 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl ${
            isFlipped ? "" : "backface-hidden"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-full flex flex-col justify-center items-center text-white p-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-xl font-bold mb-2">Payment Processing</div>
            <div className="text-gray-300 text-center">
              Your transaction is being
              <br />
              securely processed on the blockchain
            </div>
          </div>
        </motion.div>

        {/* Usage indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4"
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Credit Usage</span>
            <span>{usagePercentage.toFixed(1)}% used</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full ${
                usagePercentage > 80
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : usagePercentage > 60
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Limit: ${creditLimit.toLocaleString()}</span>
            <span>Debt: ${outstandingDebt.toFixed(2)}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

type QuickActionsProps = {
  onQuickAmount: (amount: string) => void;
  availableCredit: number;
};

const QuickActions = ({ onQuickAmount, availableCredit }: QuickActionsProps) => {
  const quickAmounts = [25, 50, 100, 250, 500].filter((amount) => amount <= availableCredit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-6"
    >
      <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Amounts</h3>
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((amount) => (
          <motion.button
            key={amount}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickAmount(amount.toString())}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 hover:border-orange-500/50 hover:text-white transition-all duration-300"
          >
            ${amount}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onQuickAmount(availableCredit.toString())}
          className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-300 hover:bg-orange-500/30 transition-all duration-300"
        >
          MAX
        </motion.button>
      </div>
    </motion.div>
  );
};

type TabToggleProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabToggle = ({ activeTab, onTabChange }: TabToggleProps) => {
  return (
    <div className="flex bg-gray-800/50 border border-gray-700/50 rounded-xl p-1 mb-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => onTabChange("payment")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative ${
          activeTab === "payment" ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {activeTab === "payment" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative flex items-center gap-2 justify-center">
          <CreditCard className="w-4 h-4" />
          Pay with Credit
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={() => onTabChange("receive")}
        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 relative ${
          activeTab === "receive" ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {activeTab === "receive" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative flex items-center gap-2 justify-center">
          <ArrowDown className="w-4 h-4" />
          Receive Payments
        </span>
      </motion.button>
    </div>
  );
};

type QRScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
};

const QRScannerModal = ({ isOpen, onClose, onScan }: QRScannerModalProps) => {
  const [scanResult, setScanResult] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (scanResult) {
      onScan(scanResult);
      setScanResult(undefined);
    }
  }, [scanResult, onScan]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Scan QR Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="relative mb-4">
          <Scanner
            onScan={(results) => {
              if (Array.isArray(results) && results.length > 0 && results[0].rawValue) {
                setScanResult(results[0].rawValue);
              }
            }}
          />
          <p className="text-gray-400 text-sm mt-2">Point your camera at a QR code to scan the wallet address</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

type PaymentSectionProps = {
  availableCredit: number;
  onPayment: (data: { recipientAddress: string; paymentAmount: string }) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  paymentAmount: string;
  setPaymentAmount: (amount: string) => void;
  isProcessing: boolean;
};

const PaymentSection = ({
  availableCredit,
  onPayment,
  recipientAddress,
  setRecipientAddress,
  paymentAmount,
  setPaymentAmount,
  isProcessing,
}: PaymentSectionProps) => {
  const [showQRScanner, setShowQRScanner] = useState(false);

  const estimatedInterest = paymentAmount ? (parseFloat(paymentAmount) * 0.05) / 12 : 0;
  const isValidPayment =
    recipientAddress && paymentAmount && parseFloat(paymentAmount) > 0 && parseFloat(paymentAmount) <= availableCredit;

  const handleQRScan = (result: string) => {
    setRecipientAddress(result);
    setShowQRScanner(false);
  };

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipientAddress(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6"
      >
        {/* Security Badge */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Shield className="w-4 h-4 text-green-400" />
          <span>Secured by blockchain technology</span>
          <Lock className="w-4 h-4 text-green-400" />
        </div>

        <QuickActions onQuickAmount={setPaymentAmount} availableCredit={availableCredit} />

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Recipient Wallet Address</label>
          <div className="relative">
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x... or ENS name"
              className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 pr-32"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQRScanner(true)}
                className="p-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-lg transition-colors duration-300"
                title="Scan QR Code"
              >
                <Scan className="w-4 h-4 text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePasteAddress}
                className="p-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-lg transition-colors duration-300"
                title="Paste from clipboard"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Payment Amount</label>
            <span className="text-sm text-gray-400">Available: ${availableCredit.toLocaleString()} USDC</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-all duration-300 pr-20 text-2xl font-bold"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <span className="text-gray-400 font-medium">USDC</span>
            </div>
          </div>

          {paymentAmount && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 p-3 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <Info className="w-4 h-4" />
                <span>Estimated monthly interest: ${estimatedInterest.toFixed(2)} USDC (5% APR)</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Button */}
        <GlowingButton
          onClick={() => onPayment({ recipientAddress, paymentAmount })}
          className="w-full py-4 text-lg font-semibold"
          disabled={!isValidPayment || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              Pay ${paymentAmount || "0"} with Credit
              <Send className="w-6 h-6" />
            </>
          )}
        </GlowingButton>

        {/* Payment Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <Lock className="w-3 h-3" />
          <span>Your payment will be processed instantly on the Flow blockchain</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {showQRScanner && (
          <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} onScan={handleQRScan} />
        )}
      </AnimatePresence>
    </>
  );
};

type ReceiveSectionProps = {
  walletAddress: string;
};

const ReceiveSection = ({ walletAddress }: ReceiveSectionProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Receive Payments</h3>
        <p className="text-gray-400 text-sm">Share your QR code or wallet address to receive payments</p>
      </div>

      <div className="bg-white p-6 mx-auto w-fit rounded-xl shadow-lg">
        <QRCodeSVG
          value={walletAddress}
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"M"}
          imageSettings={{
            src: "/logo.png",
            x: undefined,
            y: undefined,
            height: 32,
            width: 32,
            opacity: 1,
            excavate: true,
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">Your Wallet Address</p>
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-300 truncate">
              {walletAddress.slice(0, 16)}...{walletAddress.slice(-6)}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyAddress}
              className="p-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-lg transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-300">
            Others can scan this QR code or use your wallet address to send you payments directly to your wallet.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

type TransactionStatusProps = {
  status?: "pending" | "success" | "error" | null;
  message?: string;
};

const TransactionStatus = ({ status, message }: TransactionStatusProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Loader className="w-5 h-5 animate-spin" />;
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-yellow-400 border-yellow-500/20 bg-yellow-500/10";
      case "success":
        return "text-green-400 border-green-500/20 bg-green-500/10";
      case "error":
        return "text-red-400 border-red-500/20 bg-red-500/10";
      default:
        return "";
    }
  };

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-xl p-4 ${getStatusColor()}`}
    >
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
};

type Transaction = {
  type: string;
  amount: number;
  date: string;
  status: string;
  hash?: string;
  blockNumber?: number;
};

const RecentTransactions = ({
  transactions,
  loading,
  onRefresh,
}: {
  transactions: Transaction[];
  loading: boolean;
  onRefresh?: () => void;
}) => {
  const getTransactionIcon = (type: string): React.ReactElement => {
    switch (type) {
      case "payment":
        return <Send className="w-4 h-4 text-red-400" />;
      case "borrow":
        return <Download className="w-4 h-4 text-green-400" />;
      case "repay":
        return <ArrowUp className="w-4 h-4 text-cyan-400" />;
      case "stake":
        return <Wallet className="w-4 h-4 text-purple-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  interface StatusColorMap {
    [key: string]: string;
  }

  const getStatusColor = (status: string): string => {
    const statusColorMap: StatusColorMap = {
      completed: "text-green-400",
      pending: "text-yellow-400",
      failed: "text-red-400",
    };
    return statusColorMap[status] || "text-gray-400";
  };

  const getTransactionLabel = (type: string): string => {
    switch (type) {
      case "borrow":
        return "Credit Used";
      case "repay":
        return "Payment Made";
      case "stake":
        return "Collateral Added";
      case "payment":
        return "Credit Payment";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const openTransactionHash = (hash?: string) => {
    if (hash) {
      window.open(`https://evm-testnet.flowscan.io/tx/${hash}`, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-400" />
          Recent Activity
        </h3>
        {onRefresh && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            disabled={loading}
            className="p-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-orange-500/50 transition-all duration-300 disabled:opacity-50"
            title="Refresh transactions"
          >
            <motion.div
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            >
              <ArrowRight className="w-4 h-4 transform rotate-45" />
            </motion.div>
          </motion.button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 text-purple-400 mx-auto mb-3 animate-spin" />
            <p className="text-gray-400 text-sm">No activity yet</p>
            <p className="text-gray-500 text-xs mt-1">Your credit card activity will appear here</p>
          </div>
        ) : (
          <div
            className="h-full overflow-y-auto space-y-3 scrollbar-hide pr-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {transactions.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-black/40 backdrop-blur-sm rounded-xl hover:bg-black/60 transition-colors cursor-pointer"
                onClick={() => openTransactionHash(tx.hash)}
                title={tx.hash ? "Click to view on explorer" : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="text-white font-medium">{getTransactionLabel(tx.type)}</div>
                    <div className="text-gray-400 text-sm">{tx.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${tx.amount.toLocaleString()}</div>
                  <div className={`text-sm capitalize ${getStatusColor(tx.status)}`}>{tx.status}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function PaymentsPage() {
  const navigate = useNavigate();

  // Mock authentication state
  const [authenticated, setAuthenticated] = useState(true);

  const [activeTab, setActiveTab] = useState("payment");
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusState | null>(null);

  // Mock credit data
  const [creditData] = useState({
    creditLimit: 5000,
    availableCredit: 3500,
    outstandingDebt: 1525,
  });

  // Mock transactions
  const [transactions] = useState<Transaction[]>([
    { type: "payment", amount: 150, date: "2 days ago", status: "completed", hash: "0x123...abc" },
    { type: "borrow", amount: 500, date: "1 week ago", status: "completed", hash: "0x456...def" },
    { type: "repay", amount: 200, date: "2 weeks ago", status: "completed", hash: "0x789...ghi" },
  ]);

  const [loadingTransactions] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock wallet address
  const currentWalletAddress = "0x742d35Cc6634C0532925a3b8D402000BC64b2308";

  const recentTransactions = transactions;

  interface PaymentData {
    recipientAddress: string;
    paymentAmount: string;
  }

  interface TransactionStatusState {
    status: "pending" | "success" | "error";
    message: string;
  }

  const handlePayment = async (data: PaymentData): Promise<void> => {
    const { recipientAddress, paymentAmount } = data;
    const amount = parseFloat(paymentAmount);

    if (!currentWalletAddress || amount <= 0) {
      setTransactionStatus({ status: "error", message: "Invalid payment details" });
      return;
    }

    try {
      setIsProcessing(true);
      setTransactionStatus({ status: "pending", message: "Preparing credit payment..." });

      // Mock payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTransactionStatus({ status: "pending", message: "Sending payment to recipient..." });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTransactionStatus({
        status: "success",
        message: `Credit payment of ${amount.toLocaleString()} USDC sent successfully!`,
      });

      setRecipientAddress("");
      setPaymentAmount("");

      setTimeout(() => setTransactionStatus(null), 5000);
    } catch (error: any) {
      console.error("Payment error:", error);

      setTransactionStatus({ status: "error", message: "Credit payment failed. Please try again." });

      setTimeout(() => setTransactionStatus(null), 8000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <FloatingOrbs />

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <WalletSelector />
          <div className="mt-6 text-center">
            <GlowingButton onClick={handleLogin} className="text-lg px-8 py-4">
              Demo Login
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingOrbs />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                Virtual Credit Card
              </h1>
              <p className="text-gray-400 mt-2 text-lg">Pay instantly with your crypto credit line • Demo Mode</p>
            </div>
          </div>
        </div>

        <VirtualCreditCard
          creditLimit={creditData.creditLimit}
          availableCredit={creditData.availableCredit}
          outstandingDebt={creditData.outstandingDebt}
          userAddress={currentWalletAddress || ""}
          isProcessing={isProcessing}
        />

        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "payment" ? (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <PaymentSection
                    availableCredit={creditData.availableCredit}
                    onPayment={handlePayment}
                    recipientAddress={recipientAddress}
                    setRecipientAddress={setRecipientAddress}
                    paymentAmount={paymentAmount}
                    setPaymentAmount={setPaymentAmount}
                    isProcessing={isProcessing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="receive"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <ReceiveSection walletAddress={currentWalletAddress || ""} />
                </motion.div>
              )}

              <GlowingButton className="mt-4 w-full flex justify-center" onClick={() => navigate("/borrow/dashboard")}>
                <Wallet className="w-5 h-5" />
                Go to Credit Dashboard
                <ArrowRight className="w-5 h-5" />
              </GlowingButton>
            </AnimatePresence>

            <TransactionStatus status={transactionStatus?.status} message={transactionStatus?.message} />
          </div>

          <div className="lg:h-full">
            <RecentTransactions
              transactions={recentTransactions}
              loading={loadingTransactions}
              onRefresh={() => console.log("Refresh transactions")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
