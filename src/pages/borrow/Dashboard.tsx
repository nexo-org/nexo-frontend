import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CreditCard,
  DollarSign,
  ExternalLink,
  Info,
  Loader,
  Plus,
  Shield,
  Target,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlowingButton } from "../../components/GlowingButton";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import { SEO } from "../../components/SEO";

type CreditSummaryCardProps = {
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
};

const CreditSummaryCard = ({ creditLimit, usedCredit, availableCredit }: CreditSummaryCardProps) => {
  const usagePercentage = (usedCredit / creditLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-8 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <CreditCard className="w-6 h-6 text-black" />
        <h2 className="text-xl font-semibold text-black">Crypto Credit Overview</h2>
      </div>

      <div className="mb-6">
        <div className="text-5xl font-bold text-transparent bg-gradient-to-r from-black to-red-400 bg-clip-text mb-2">
          ${creditLimit.toLocaleString()}
        </div>
        <div className="text-gray-600">Total Credit Limit</div>
      </div>

      <div className="mb-6">
        <div className="text-2xl font-bold text-black mb-2">${availableCredit.toLocaleString()}</div>
        <div className="text-gray-600 text-sm">Available Credit</div>
      </div>

      {/* Credit Usage Bar */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${usagePercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gradient-to-r from-black to-red-500 h-3 rounded-full"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Used: ${usedCredit.toLocaleString()}</span>
        <span>{usagePercentage.toFixed(1)}% utilized</span>
      </div>
    </motion.div>
  );
};

type CollateralCardProps = {
  stakedAmount: number;
  onStakeMore: () => void;
};

const CollateralCard = ({ stakedAmount, onStakeMore }: CollateralCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex flex-col justify-between bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Collateral</h3>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute right-0 top-6 w-64 bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            Your staked USDC acts as collateral and determines your credit limit
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-black mb-1">${stakedAmount.toLocaleString()}</div>
        <div className="text-gray-600 text-sm">USDC Staked</div>
      </div>

      <GlowingButton onClick={onStakeMore} className="w-full">
        <Plus className="w-4 h-4" />
        Stake More
      </GlowingButton>
    </motion.div>
  );
};

type OutstandingLoanCardProps = {
  principal: number;
  interest: number;
  isOverdue: boolean;
  daysUntilDue: number;
  onRepay: () => void;
  isRepayLoading?: boolean;
};

const OutstandingLoanCard = ({
  principal,
  interest,
  isOverdue,
  daysUntilDue,
  onRepay,
  isRepayLoading = false,
}: OutstandingLoanCardProps) => {
  const totalDebt = principal + interest;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`flex flex-col justify-between bg-gray-50/80 backdrop-blur-2xl border rounded-2xl p-6 ${
        isOverdue ? "border-red-500/50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Outstanding Loan</h3>
        </div>
        {(isOverdue || daysUntilDue <= 3) && (
          <div className="flex items-center gap-1 text-black">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{isOverdue ? "Overdue" : `${daysUntilDue} days left`}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Principal</span>
          <span className="text-black font-medium">${principal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Interest</span>
          <span className="text-black font-medium">${interest.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between">
            <span className="text-black font-semibold">Total Debt</span>
            <span className="text-xl font-bold text-black">${totalDebt.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {totalDebt > 0 ? (
        <GlowingButton onClick={onRepay} className="w-full" disabled={isRepayLoading}>
          {isRepayLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Processing Repayment...
            </>
          ) : (
            <>
              Make Repayment
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </GlowingButton>
      ) : (
        <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 text-center">
          <div className="text-green-400 font-medium mb-1">✅ All Paid Up!</div>
          <div className="text-green-300 text-sm">No outstanding debt</div>
        </div>
      )}
    </motion.div>
  );
};

type ReputationCardProps = {
  creditScore: number;
  potentialIncrease: number;
  onViewDetails: () => void;
};

const ReputationCard = ({ creditScore, potentialIncrease, onViewDetails }: ReputationCardProps) => {
  const scorePercentage = (creditScore / 850) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col justify-between bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-black" />
        <h3 className="text-lg font-semibold text-black">Credit Score</h3>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-black to-red-400 bg-clip-text mb-2">
          {creditScore}
        </div>
        <div className="text-gray-600 text-sm">Your Credit Score</div>
      </div>

      {/* Score Progress Bar */}
      <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${scorePercentage}%` }}
          transition={{ duration: 1, delay: 0.8 }}
          className="bg-gradient-to-r from-black to-red-500 h-2 rounded-full"
        />
      </div>

      <div className="text-center mb-4">
        <div className="text-sm text-gray-600 mb-1">Potential Credit Increase</div>
        <div className="text-lg font-semibold text-black">+${potentialIncrease.toLocaleString()}</div>
      </div>

      <GlowingButton onClick={onViewDetails} variant="secondary" className="w-full">
        View Details
        <ExternalLink className="w-4 h-4" />
      </GlowingButton>
    </motion.div>
  );
};

type ActivityType = "borrow" | "repay" | "stake" | "payment" | string;
type ActivityStatus = "completed" | "pending" | "failed" | string;

type RecentActivityProps = {
  activities: {
    type: ActivityType;
    amount: number;
    date: string;
    status: ActivityStatus;
  }[];
  onViewAll: () => void;
};

const RecentActivity = ({ activities, onViewAll }: RecentActivityProps) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "borrow":
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      case "repay":
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case "stake":
        return <Shield className="w-4 h-4 text-black" />;
      case "payment":
        return <DollarSign className="w-4 h-4 text-black" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ActivityStatus): string => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Recent Activity</h3>
        </div>
        <GlowingButton onClick={onViewAll} variant="secondary">
          View All
        </GlowingButton>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-100/80 backdrop-blur-sm rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <div className="text-black font-medium capitalize">{activity.type}</div>
                <div className="text-gray-600 text-sm">{activity.date}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-black font-medium">${activity.amount.toLocaleString()}</div>
              <div className={`text-sm capitalize ${getStatusColor(activity.status)}`}>{activity.status}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function BorrowerDashboard() {
  const navigate = useNavigate();

  // Mock authentication state
  const [authenticated, setAuthenticated] = useState(true);

  // State for mock data (replacing smart contract data)
  const [loading, _setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repayLoading, setRepayLoading] = useState(false);

  // Mock credit data
  const [creditData] = useState({
    creditLimit: 5000,
    usedCredit: 1500,
    availableCredit: 3500,
    stakedCollateral: 5000,
    loanPrincipal: 1500,
    loanInterest: 25,
    totalDebt: 1525,
    isOverdue: false,
    daysUntilDue: 15,
    isActive: true,
  });

  // Mock reputation data
  const [reputationData] = useState({
    creditScore: 720,
    potentialIncrease: 1000,
    onTimeRepayments: 8,
    lateRepayments: 1,
    totalRepaid: 2500,
  });

  // Mock recent activities
  const [recentActivities] = useState([
    { type: "payment", amount: 150, date: "2 days ago", status: "completed" },
    { type: "borrow", amount: 500, date: "1 week ago", status: "completed" },
    { type: "repay", amount: 200, date: "2 weeks ago", status: "completed" },
    { type: "stake", amount: 2000, date: "3 weeks ago", status: "completed" },
  ]);

  const handleStakeMore = () => {
    navigate("/borrow/stake");
  };

  const handleRepay = async () => {
    if (creditData.totalDebt <= 0) {
      return;
    }

    try {
      setRepayLoading(true);

      // Mock repayment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would update the credit data
      console.log("Mock repayment completed");
    } catch (error: any) {
      console.error("Repayment error:", error);
    } finally {
      setRepayLoading(false);
    }
  };

  const handleViewReputation = () => {
    console.log("View reputation details");
  };

  const handleViewAllActivity = () => {
    console.log("View all activity");
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-8 text-center"
          >
            <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-black mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Fetching your credit information</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-white text-black">

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-2xl border border-red-500/50 rounded-2xl p-8 text-center"
          >
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <GlowingButton onClick={() => setError(null)} className="text-lg px-8 py-4">
              Try Again
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white text-black">

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-8 text-center"
          >
            <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-4">Connect to View Dashboard</h2>
            <p className="text-gray-600 mb-6">Connect to access your borrower dashboard and manage your credit</p>
            <div className="space-y-4">
              <LoginWithGoogleButton />
              <GlowingButton onClick={handleLogin} className="text-lg px-8 py-4 w-full">
                Demo Login
                <ArrowRight className="w-5 h-5" />
              </GlowingButton>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pt-20">
      <SEO
        title="Crypto Credit Dashboard | Manage Your USDC Credit Line | Aion"
        description="Manage your crypto-backed credit line dashboard. View USDC collateral, outstanding loans, credit utilization, and make repayments. Monitor your crypto credit score and available spending power."
        keywords="crypto credit dashboard, USDC credit line, crypto collateral management, crypto credit score, crypto backed loan dashboard, stablecoin credit management, crypto credit utilization, yield earning collateral"
        ogTitle="Crypto Credit Dashboard - Manage Your Digital Asset Credit"
        ogDescription="Complete dashboard for managing your crypto-backed credit. Track USDC collateral, monitor credit utilization, view outstanding loans, and optimize your crypto credit score."
        twitterTitle="Crypto Credit Dashboard | USDC Collateral Management"
        twitterDescription="Manage your crypto credit line with real-time dashboard. Track USDC collateral, credit utilization, and earn yield while maintaining spending power."
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
            Your Crypto Credit Dashboard
          </h1>
        </motion.div>

        {/* Show different content based on whether user has an active credit line */}
        {!creditData.isActive ? (
          // No active credit line - show call to action
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50/80 backdrop-blur-2xl border border-gray-200 rounded-2xl p-8 text-center"
          >
            <CreditCard className="w-16 h-16 text-black mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-black mb-4">No Active Crypto Credit Line</h2>
            <p className="text-gray-600 mb-6">
              Stake your USDC as collateral to unlock crypto-backed credit and start spending crypto without selling your assets
            </p>
            <GlowingButton onClick={handleStakeMore} className="text-lg px-8 py-4">
              Stake USDC & Get Crypto Credit
              <ArrowRight className="w-5 h-5" />
            </GlowingButton>
          </motion.div>
        ) : (
          // Active credit line - show dashboard
          <>
            {/* Credit Summary - Full Width */}
            <div className="mb-8">
              <CreditSummaryCard
                creditLimit={creditData.creditLimit}
                usedCredit={creditData.usedCredit}
                availableCredit={creditData.availableCredit}
              />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <CollateralCard stakedAmount={creditData.stakedCollateral} onStakeMore={handleStakeMore} />

              <OutstandingLoanCard
                principal={creditData.loanPrincipal}
                interest={creditData.loanInterest}
                isOverdue={creditData.isOverdue}
                daysUntilDue={creditData.daysUntilDue}
                onRepay={handleRepay}
                isRepayLoading={repayLoading}
              />

              <ReputationCard
                creditScore={reputationData.creditScore}
                potentialIncrease={reputationData.potentialIncrease}
                onViewDetails={handleViewReputation}
              />
            </div>

            {/* Recent Activity - Full Width */}
            <RecentActivity activities={recentActivities} onViewAll={handleViewAllActivity} />
          </>
        )}
      </div>
    </div>
  );
}
