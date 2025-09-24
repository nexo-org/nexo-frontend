import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  DollarSign,
  PieChart,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FloatingOrbs } from "../../components/FloatingOrbs";
import { GlowingButton } from "../../components/GlowingButton";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend?: number;
  className?: string;
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, className = "" }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 group hover:border-orange-500/40 transition-all duration-300 ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.05), inset 0 1px 0 rgba(249, 115, 22, 0.1)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
            <TrendingUp className="w-4 h-4" />
            <span>
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </motion.div>
  );
};

const PortfolioOverview = () => {
  // Mock data
  const portfolioData = {
    totalValue: 15750.25,
    totalEarned: 1125.50,
    currentAPY: 12.5,
    activePositions: 3,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Portfolio Value"
        value={`$${portfolioData.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        icon={DollarSign}
      />
      <StatCard
        title="Total Earned"
        value={`$${portfolioData.totalEarned.toFixed(2)}`}
        subtitle="All time"
        icon={TrendingUp}
        trend={8.2}
      />
      <StatCard title="Current APY" value={`${portfolioData.currentAPY}%`} icon={Target} trend={2.1} />
      <StatCard title="Active Positions" value={portfolioData.activePositions.toString()} icon={PieChart} />
    </div>
  );
};

type Position = {
  id: string;
  token: string;
  amount: number;
  apy: number;
  lockupPeriod: string;
  timeRemaining: string;
  earned: number;
  status: string;
};

const ActivePositions = () => {
  // Mock positions data
  const positions: Position[] = [
    {
      id: "1",
      token: "USDC",
      amount: 5000.00,
      apy: 12.5,
      lockupPeriod: "3 months",
      timeRemaining: "45 days",
      earned: 156.25,
      status: "earning",
    },
    {
      id: "2",
      token: "USDC",
      amount: 10000.00,
      apy: 15.0,
      lockupPeriod: "12 months",
      timeRemaining: "8 months",
      earned: 969.25,
      status: "earning",
    },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8 mb-8"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Active Positions</h2>
        {positions.length > 0 && (
          <GlowingButton variant="secondary" className="text-sm">
            Manage All
          </GlowingButton>
        )}
      </div>

      {positions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Active Positions</h3>
          <p className="text-gray-400 mb-6">Start lending to see your positions here</p>
          <GlowingButton onClick={() => (window.location.href = "/lend/deposit")} className="text-sm">
            Start Lending
            <ArrowRight className="w-4 h-4" />
          </GlowingButton>
        </div>
      ) : (
        <div className="space-y-4">
          {positions.map((position) => (
            <motion.div
              key={position.id}
              whileHover={{ scale: 1.01 }}
              className="bg-black/30 backdrop-blur-sm border border-orange-500/10 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-white font-bold text-sm">{position.token}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      $
                      {position.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-gray-400 text-sm">{position.token}</div>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="text-orange-400 font-semibold">{position.apy}% APY</div>
                  <div className="text-gray-400 text-sm">{position.lockupPeriod}</div>
                </div>

                <div className="text-center md:text-left">
                  <div className="text-white font-semibold">${position.earned.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Earned</div>
                </div>

                <div className="flex items-center justify-center md:justify-end gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">{position.timeRemaining}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const PoolStats = () => {
  // Mock pool data
  const poolData = {
    utilization: 78.5,
    totalBorrowed: 125000,
    totalSupplied: 159000,
    activeBorrowers: 42,
    avgCollateralRatio: 142,
    riskLevel: "Low",
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Pool Health & Statistics</h2>
        <div className="flex items-center gap-1 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{poolData.riskLevel} Risk</span>
        </div>
      </div>

      {/* Utilization Rate */}
      <div className="bg-black/30 backdrop-blur-sm border border-orange-500/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 font-medium">Pool Utilization</span>
          <span className="text-2xl font-bold text-orange-400">{poolData.utilization.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-orange-500/20"
            style={{ width: `${Math.min(poolData.utilization, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Total Borrowed: ${poolData.totalBorrowed.toLocaleString()}</span>
          <span>Total Supplied: ${poolData.totalSupplied.toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Available Liquidity"
          value={`$${(poolData.totalSupplied - poolData.totalBorrowed).toLocaleString()}`}
          icon={Users}
        />
        <StatCard title="Avg. Collateral Ratio" value={`${poolData.avgCollateralRatio}%`} icon={Shield} />
        <StatCard title="Risk Level" value={poolData.riskLevel} subtitle="Well collateralized" icon={Activity} />
      </div>
    </div>
  );
};

type UnauthorizedViewProps = {
  onLogin: () => void;
};

const UnauthorizedView = ({ onLogin }: UnauthorizedViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/40 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-12 text-center"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(249, 115, 22, 0.2)'
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
          <PieChart className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">View Your Portfolio</h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Connect your wallet to access your complete portfolio dashboard with real-time tracking of your lending
          positions, earnings, and performance analytics.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-orange-400" />
            <span>Track lending positions and earnings</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-orange-400" />
            <span>Monitor APY and performance metrics</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <CheckCircle className="w-5 h-5 text-orange-400" />
            <span>Access detailed pool analytics</span>
          </div>
        </div>

        <GlowingButton onClick={onLogin} className="text-lg px-8 py-4">
          Connect Wallet
          <ArrowRight className="w-5 h-5" />
        </GlowingButton>
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <FloatingOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-amber-200 bg-clip-text text-transparent">
            Your Portfolio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete overview of your lending positions and earnings
          </p>
        </motion.div>

        {/* Main Content */}
        {!isConnected ? (
          <UnauthorizedView onLogin={handleConnect} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <PortfolioOverview />
            <ActivePositions />
            <PoolStats />
          </motion.div>
        )}
      </div>
    </div>
  );
}
      