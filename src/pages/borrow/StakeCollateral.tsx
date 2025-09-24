import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, CreditCard, DollarSign, Info, Loader, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FloatingOrbs } from "../../components/FloatingOrbs";
import { GlowingButton } from "../../components/GlowingButton";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";

type WalletType = "privy" | null;

type WalletSelectorProps = {
  onSelectWallet: (type: WalletType) => void;
  selectedWallet: WalletType;
};

const WalletSelector = ({ onSelectWallet, selectedWallet }: WalletSelectorProps) => {
  const handlePrivyConnect = () => {
    onSelectWallet("privy");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <CreditCard className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Choose Your Login Method</h2>
        <p className="text-gray-400">Connect with a traditional software wallet or use Google for quick access</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
        {/* Privy Wallet Option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrivyConnect}
          className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left min-h-[120px] touch-manipulation ${
            selectedWallet === "privy"
              ? "border-orange-500 bg-orange-500/10 backdrop-blur-sm"
              : "border-white/10 hover:border-orange-500/50 bg-black/20 backdrop-blur-sm active:border-orange-500/70"
          }`}
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mr-3" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">Software Wallet</h3>
              <p className="text-xs sm:text-sm text-gray-400">MetaMask, WalletConnect, etc.</p>
            </div>
          </div>
          <ul className="text-xs sm:text-sm text-gray-300 space-y-1 sm:space-y-2">
            <li className="flex items-center">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2 flex-shrink-0" />
              Quick setup
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2 flex-shrink-0" />
              Multiple wallet support
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2 flex-shrink-0" />
              Cross-platform
            </li>
          </ul>
        </motion.button>

        {/* Google Login Option */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <LoginWithGoogleButton />
          </div>
          <p className="text-xs text-gray-500 text-center">Quick access with Google</p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">Both options provide secure access to your credit line</p>
      </div>
    </motion.div>
  );
};

export default function StakeCollateral() {
  const navigate = useNavigate();

  // Mock authentication states
  const [authenticated, setAuthenticated] = useState(false);

  const [stakeAmount, setStakeAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "approving" | "staking" | "success" | "error">(
    "idle"
  );

  // Mock user data
  const [userBalance] = useState("10000000000"); // 10,000 USDC in wei format
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Mock existing credit info
  const [existingCreditInfo] = useState({
    collateralDeposited: 2500,
    creditLimit: 2500,
    borrowedAmount: 500,
    interestAccrued: 12.5,
    totalDebt: 512.5,
    repaymentDueDate: Date.now() / 1000 + 30 * 24 * 60 * 60, // 30 days from now
    isActive: true,
  });

  const [hasExistingCredit] = useState(true);
  const [reputationScore] = useState(720);
  const [creditIncreaseEligibility] = useState({ eligible: true, newLimit: 3500 });

  // Simplified wallet state
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null);

  // Mock wallet info
  const isWalletConnected = authenticated;
  const walletAddress = authenticated ? "0x742d35Cc6634C0532925a3b8D402000BC64b2308" : null;
  const currentWalletType: WalletType = authenticated ? "privy" : null;
  const currentWalletAddress = walletAddress;

  const usdcBalance = parseFloat(userBalance) / 1e6;
  const baseCreditRatio = 1.0;

  const handleWalletSelection = (type: WalletType) => {
    setSelectedWallet(type);
    if (type === "privy") {
      setAuthenticated(true);
    }
  };

  const handleOpenCreditLine = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !walletAddress) return;

    try {
      setTransactionStatus("staking");
      setErrorMessage("");

      // Mock transaction process
      toast.success("Opening credit line...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTransactionStatus("success");
      setStakeAmount("");

      setTimeout(() => setTransactionStatus("idle"), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to open credit line");
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus("idle"), 5000);
    }
  };

  const handleAddCollateral = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !walletAddress) return;

    try {
      setTransactionStatus("staking");
      setErrorMessage("");

      // Mock transaction process
      toast.success("Adding collateral...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setTransactionStatus("success");
      setStakeAmount("");

      setTimeout(() => setTransactionStatus("idle"), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to add collateral");
      setTransactionStatus("error");
      setTimeout(() => setTransactionStatus("idle"), 5000);
    }
  };

  const handleStake = () => {
    if (!isWalletConnected) {
      return;
    }

    if (hasExistingCredit) {
      handleAddCollateral();
    } else {
      handleOpenCreditLine();
    }
  };

  const calculateCreditLimit = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return 0;
    return parseFloat(stakeAmount) * baseCreditRatio;
  };

  const isValidAmount = stakeAmount && parseFloat(stakeAmount) > 0 && parseFloat(stakeAmount) <= usdcBalance;
  const isLoading = transactionStatus === "approving" || transactionStatus === "staking";
  const canStake = isWalletConnected && isValidAmount && !isLoading;

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <FloatingOrbs />

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <WalletSelector onSelectWallet={handleWalletSelection} selectedWallet={selectedWallet} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingOrbs />

      {/* Wallet Info */}
      <div className="flex items-center gap-4 w-full justify-end p-4">
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Wallet className="w-4 h-4 text-orange-400" />
            <span className="font-mono">
              {currentWalletAddress?.slice(0, 6)}...{currentWalletAddress?.slice(-4)}
            </span>
          </div>
          <div className="text-xs text-gray-500">Software Wallet</div>
        </div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
            {hasExistingCredit ? "Add More Collateral" : "Stake USDC as Collateral"}
          </h1>
          {hasExistingCredit && <p className="text-gray-400 text-lg">Add more USDC to increase your credit limit</p>}
        </motion.div>

        {hasExistingCredit && existingCreditInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-orange-400" />
              {existingCreditInfo.collateralDeposited > 0 ? "Current Credit Line" : "Active Credit Line"}
            </h3>
            {existingCreditInfo.collateralDeposited > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Collateral Deposited</div>
                  <div className="text-xl font-bold text-white">
                    ${existingCreditInfo.collateralDeposited.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Credit Limit</div>
                  <div className="text-xl font-bold text-orange-400">${existingCreditInfo.creditLimit.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Amount Borrowed</div>
                  <div className="text-xl font-bold text-red-400">${existingCreditInfo.borrowedAmount.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Available Credit</div>
                  <div className="text-xl font-bold text-green-400">
                    ${(existingCreditInfo.creditLimit - existingCreditInfo.borrowedAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-2">
                  You have an active credit line but no collateral deposited
                </div>
                <div className="text-lg font-medium text-yellow-400">
                  Add collateral below to increase your credit limit
                </div>
              </div>
            )}
          </motion.div>
        )}

        {!isWalletConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-white mb-2">Detecting Wallet Connection...</h2>
            <p className="text-gray-400 mb-4">Please wait while we check your wallet status</p>
            <button
              onClick={() => setAuthenticated(true)} // Skip wallet detection for demo
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors duration-300"
            >
              Skip and continue
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-8"
          >
            <div className="mb-8">
              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 focus-within:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <input
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-4xl font-bold text-white placeholder-gray-500 focus:outline-none w-full"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-gray-400">USDC</span>
                    <button
                      onClick={() => setStakeAmount(usdcBalance.toString())}
                      className="px-3 py-1 bg-orange-500/20 backdrop-blur-sm border border-orange-500/50 rounded-lg text-orange-400 hover:text-orange-300 transition-colors duration-300 text-sm font-medium"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 px-2">
                <span className="text-gray-400 text-sm">Balance: {usdcBalance.toFixed(2)} USDC</span>
                {false && <span className="text-yellow-400 text-sm">Will require approval</span>}
              </div>
            </div>

            {stakeAmount && parseFloat(stakeAmount) > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 mb-8"
              >
                <div className="text-center">
                  <div className="text-gray-400 text-sm mb-2">
                    {hasExistingCredit ? "Additional Credit" : "Credit Limit"}
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text">
                    ${calculateCreditLimit().toFixed(2)}
                  </div>
                  {hasExistingCredit && existingCreditInfo && (
                    <div className="mt-2 text-gray-400 text-sm">
                      New Total: ${(existingCreditInfo.creditLimit + calculateCreditLimit()).toFixed(2)}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {hasExistingCredit && authenticated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 mb-8"
              >
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-400" />
                  Reputation & Credit Increases
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Reputation Score</div>
                    <div className="text-lg font-bold text-orange-400">{reputationScore}/1000</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Credit Increase Eligible</div>
                    <div
                      className={`text-lg font-bold ${creditIncreaseEligibility.eligible ? "text-green-400" : "text-red-400"}`}
                    >
                      {creditIncreaseEligibility.eligible ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
                {creditIncreaseEligibility.eligible && (
                  <div className="mt-3 p-3 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg">
                    <div className="text-green-400 text-sm font-medium">
                      🎉 Eligible for credit increase to ${creditIncreaseEligibility.newLimit.toFixed(2)}
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  Credit multipliers (1.2x) are automatically applied after good repayment history
                </div>
              </motion.div>
            )}

            <div className="text-center text-gray-400 text-sm mb-8 leading-relaxed">
              {hasExistingCredit
                ? "Adding more USDC will increase your credit limit at a 1:1 ratio. Credit multipliers are earned through good repayment history."
                : "Your staked USDC secures your credit line at a 1:1 ratio (100% of collateral)."}
            </div>

            <GlowingButton onClick={handleStake} className="w-full text-xl py-6" disabled={!canStake}>
              {transactionStatus === "approving" ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Approving USDC...
                </>
              ) : transactionStatus === "staking" ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  {hasExistingCredit ? "Adding Collateral..." : "Opening Credit Line..."}
                </>
              ) : transactionStatus === "success" ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  {hasExistingCredit ? "Collateral Added!" : "Credit Line Opened!"}
                </>
              ) : !isWalletConnected ? (
                <>
                  Connect Wallet
                  <Wallet className="w-6 h-6" />
                </>
              ) : hasExistingCredit ? (
                <>
                  {existingCreditInfo?.collateralDeposited > 0 ? "Add More Collateral" : "Add Initial Collateral"}
                  <Plus className="w-6 h-6" />
                </>
              ) : (
                <>
                  Open Credit Line
                  <DollarSign className="w-6 h-6" />
                </>
              )}
            </GlowingButton>

            {transactionStatus === "error" && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 flex items-center gap-3 mt-6"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <div className="text-red-400 font-medium">Transaction Failed</div>
                  <div className="text-red-300 text-sm">{errorMessage}</div>
                </div>
              </motion.div>
            )}

            {transactionStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 backdrop-blur-sm border border-green-500/50 rounded-xl p-4 flex items-center gap-3 mt-6"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <div className="text-green-400 font-medium">
                    {hasExistingCredit ? "Collateral Added Successfully!" : "Stake"}
                  </div>
                  <div className="text-green-300 text-sm">
                    {hasExistingCredit
                      ? "Your credit limit has been increased."
                      : "You can now borrow against your collateral."}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
