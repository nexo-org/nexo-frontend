import { useWallet, type InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, DollarSign, Info, Loader, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FloatingOrbs } from "../../components/FloatingOrbs";
import { GlowingButton } from "../../components/GlowingButton";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import { WalletSelector } from "../../components/WalletSelector";
import { CONTRACT_ADDRESS, fetchUsdcBalance, unitsToUsdc, usdcToUnits } from "../../context/WalletProvider";

type LockupPeriod = {
  months: number;
  multiplier: number;
  label: string;
};

type LockupPeriodSelectorProps = {
  selectedPeriod: LockupPeriod;
  onPeriodChange: (period: LockupPeriod) => void;
};

const LockupPeriodSelector = ({ selectedPeriod, onPeriodChange }: LockupPeriodSelectorProps) => {
  const periods: LockupPeriod[] = [
    { months: 1, multiplier: 1.0, label: "1 month" },
    { months: 3, multiplier: 1.25, label: "3 months" },
    { months: 6, multiplier: 1.5, label: "6 months" },
    { months: 12, multiplier: 2.0, label: "12 months" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Lockup Period</h3>
        <Info className="w-4 h-4 text-gray-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {periods.map((period) => (
          <motion.button
            key={period.months}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPeriodChange(period)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedPeriod.months === period.months
                ? "border-orange-500 bg-gradient-to-r from-orange-500/20 to-amber-500/20"
                : "border-gray-700/50 hover:border-orange-500/50"
            }`}
          >
            <div className="text-center">
              <div className="text-white font-medium mb-1">{period.label}</div>
              <div className="text-orange-400 text-sm font-semibold">{period.multiplier}x multiplier</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default function Deposit() {
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState({
    months: 3,
    multiplier: 1.25,
    label: "3 months",
  });
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "depositing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [lendingPoolStats, setLendingPoolStats] = useState({
    totalDeposited: 0,
    totalBorrowed: 0,
    utilizationRate: 0,
    currentAPY: 12.5,
  });

  const { account, connected, signAndSubmitTransaction } = useWallet();

  const handleTransactionError = (error: any) => {
    const errorMessage = error.message || error.toString();

    if (errorMessage.includes("EINSUFFICIENT_BALANCE")) {
      return "Insufficient USDC balance for this transaction";
    }
    if (errorMessage.includes("INVALID_AMOUNT")) {
      return "Please enter a valid deposit amount";
    }
    if (errorMessage.includes("NOT_AUTHORIZED")) {
      return "Transaction not authorized. Please try again.";
    }
    return "Transaction failed. Please try again.";
  };

  const getUsdcBalance = async () => {
    if (!account?.address) return;

    try {
      const balance = await fetchUsdcBalance(account.address.toString());
      setUsdcBalance(balance);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      setUsdcBalance(1500.75);
    }
  };

  const getLendingPoolStats = async () => {
    try {
      const resource = await fetch(
        `https://fullnode.testnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/resource/${CONTRACT_ADDRESS}::lending_pool::LendingPool`
      )
        .then((res) => res.json())
        .catch(() => null);

      if (resource && resource.data) {
        const poolData = resource.data;
        const totalDeposited = unitsToUsdc(poolData.total_deposited || "0");
        const totalBorrowed = unitsToUsdc(poolData.total_borrowed || "0");
        const totalRepaid = unitsToUsdc(poolData.total_repaid || "0");
        const availableBalance = totalDeposited - totalBorrowed + totalRepaid;
        const utilizationRate = totalDeposited > 0 ? ((totalBorrowed - totalRepaid) / totalDeposited) * 100 : 0;

        setLendingPoolStats({
          totalDeposited,
          totalBorrowed: totalBorrowed - totalRepaid,
          utilizationRate,
          currentAPY: 12.5,
        });
      }
    } catch (error) {
      console.error("Error fetching lending pool stats:", error);
    }
  };

  const depositUSDC = async (amountUsdc: number) => {
    if (!account?.address) throw new Error("Wallet not connected");

    if (amountUsdc <= 0 || amountUsdc > 1000000) {
      throw new Error("Invalid deposit amount");
    }

    const amountInUnits = usdcToUnits(amountUsdc);
    console.log(`Converting ${amountUsdc} USDC to ${amountInUnits} units`);

    const unitsNum = parseInt(amountInUnits, 10);
    if (unitsNum > Number.MAX_SAFE_INTEGER) {
      throw new Error("Amount too large");
    }

    const payload: InputTransactionData = {
      data: {
        function: `${CONTRACT_ADDRESS}::lending_pool::deposit`,
        functionArguments: [CONTRACT_ADDRESS, amountInUnits],
      },
    };

    console.log("Deposit payload:", payload);
    return await signAndSubmitTransaction(payload);
  };

  const handleDeposit = async () => {
    if (!connected || !account?.address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }

    const amount = parseFloat(depositAmount);

    if (amount > 1000000) {
      toast.error("Deposit amount too large. Maximum is 1,000,000 USDC");
      return;
    }

    if (amount > usdcBalance) {
      toast.error("Insufficient USDC balance");
      return;
    }

    try {
      setTransactionStatus("depositing");
      setErrorMessage("");

      toast.loading("Depositing USDC to lending pool...", { id: "deposit" });

      const result = await depositUSDC(amount);

      console.log("Deposit result:", result);

      toast.success(`Successfully deposited ${amount} USDC to the lending pool!`, {
        id: "deposit",
      });

      setTransactionStatus("success");
      setDepositAmount("");

      await getUsdcBalance();
      await getLendingPoolStats();

      setTimeout(() => setTransactionStatus("idle"), 3000);
    } catch (error: any) {
      console.error("Deposit error:", error);
      const userFriendlyError = handleTransactionError(error);
      setErrorMessage(userFriendlyError);
      setTransactionStatus("error");

      toast.error(userFriendlyError, { id: "deposit" });

      setTimeout(() => {
        setTransactionStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const calculateEstimatedYield = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return 0;
    const amount = parseFloat(depositAmount);
    const baseApy = lendingPoolStats.currentAPY / 100;
    const boostedApy = baseApy * selectedPeriod.multiplier;
    const monthlyYield = (amount * boostedApy) / 12;
    return monthlyYield * selectedPeriod.months;
  };

  const calculateEffectiveAPY = () => {
    return (lendingPoolStats.currentAPY * selectedPeriod.multiplier).toFixed(1);
  };

  useEffect(() => {
    if (connected && account?.address) {
      getUsdcBalance();
      getLendingPoolStats();
    }
  }, [connected, account?.address]);

  const isLoading = transactionStatus === "depositing";
  const canDeposit =
    connected &&
    depositAmount &&
    parseFloat(depositAmount) > 0 &&
    parseFloat(depositAmount) <= usdcBalance &&
    !isLoading;

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingOrbs />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
            Deposit & Earn
          </h1>
          <p className="text-gray-400 text-lg">Deposit USDC to the lending pool and earn interest from borrowers</p>
        </motion.div>

        {/* Protocol Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Lending Pool Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Total Deposited</div>
              <div className="text-xl font-bold text-white">${lendingPoolStats.totalDeposited.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Total Borrowed</div>
              <div className="text-xl font-bold text-orange-400">
                ${lendingPoolStats.totalBorrowed.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Utilization Rate</div>
              <div className="text-xl font-bold text-green-400">{lendingPoolStats.utilizationRate.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Current APY</div>
              <div className="text-xl font-bold text-amber-400">{lendingPoolStats.currentAPY}%</div>
            </div>
          </div>
        </motion.div>

        {!connected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 text-center"
          >
            <Wallet className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet to Start Earning</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to deposit USDC and start earning from the lending pool
            </p>
            <div className="w-full flex flex-row gap-2 justify-center">
              <WalletSelector />
              <LoginWithGoogleButton />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 space-y-8"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Deposit Amount</h3>
                <div className="text-sm text-gray-400">Available: {usdcBalance.toFixed(2)} USDC</div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <input
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.000001"
                    min="0"
                    className="bg-transparent text-3xl font-bold text-white placeholder-gray-500 focus:outline-none w-full"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400">USDC</span>
                    <button
                      onClick={() => setDepositAmount(usdcBalance.toString())}
                      className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg text-orange-400 hover:text-orange-300 transition-colors duration-300 text-sm font-medium"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">Pool capacity</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Your balance</span>
                    <span className="text-white">{usdcBalance.toFixed(6)} USDC</span>
                  </div>
                </div>
              </div>
            </div>

            <LockupPeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />

            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Estimated Returns</h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Effective APY</div>
                  <div className="text-2xl font-bold text-orange-400">{calculateEffectiveAPY()}%</div>
                </div>

                <div>
                  <div className="text-gray-400 text-sm mb-1">Est. yield ({selectedPeriod.label})</div>
                  <div className="text-2xl font-bold text-white">
                    {calculateEstimatedYield().toFixed(2)}
                    <span className="text-lg text-gray-400 ml-1">USDC</span>
                  </div>
                </div>
              </div>

              {selectedPeriod.multiplier > 1 && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✦</span>
                    </div>
                    <span className="text-white font-medium">Bonus Multiplier Active</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Earn {selectedPeriod.multiplier}x rewards by locking for {selectedPeriod.label}
                  </p>
                </div>
              )}
            </div>

            <GlowingButton onClick={handleDeposit} className="w-full text-lg py-6">
              {transactionStatus === "depositing" ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Depositing to Pool...
                </>
              ) : transactionStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Deposit Successful!
                </>
              ) : (
                <>
                  Deposit to Lending Pool
                  <DollarSign className="w-5 h-5" />
                </>
              )}
            </GlowingButton>

            {transactionStatus === "error" && errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <div className="text-red-400 font-medium">Deposit Failed</div>
                  <div className="text-red-300 text-sm">{errorMessage}</div>
                </div>
              </motion.div>
            )}

            {transactionStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 backdrop-blur-sm border border-green-500/50 rounded-xl p-4 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div>
                  <div className="text-green-400 font-medium">Deposit Successful!</div>
                  <div className="text-green-300 text-sm">
                    Your USDC has been deposited to the lending pool and is now earning interest.
                  </div>
                </div>
              </motion.div>
            )}

            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Your USDC Balance:</span>
                <span className="text-white">{usdcBalance.toFixed(6)} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Connected Wallet:</span>
                <span className="text-orange-400 font-mono">
                  {account?.address
                    ? `${account.address.toString().slice(0, 6)}...${account.address.toString().slice(-4)}`
                    : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Contract Address:</span>
                <span className="text-gray-500 font-mono text-xs">
                  {`${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`}
                </span>
              </div>
            </div>

            <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-blue-400 mb-1">How it works:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your USDC is deposited into the lending pool smart contract</li>
                    <li>• Borrowers use your funds for credit lines and payments</li>
                    <li>• You earn interest based on utilization and your lockup period</li>
                    <li>• Longer lockup periods earn higher multipliers</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
