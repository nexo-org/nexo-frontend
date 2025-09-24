import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, DollarSign, Menu, PieChart, Wallet, X } from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export const Sidebar = ({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) => {
  const menuItems = [
    {
      id: "deposit",
      label: "Deposit",
      icon: DollarSign,
      description: "Lend tokens and earn yield",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: PieChart,
      description: "View your investments",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-black/80 lg:backdrop-blur-xl lg:border-r lg:border-orange-500/20">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-orange-500/20">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-12 h-12 flex items-center justify-center"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  Nexo
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50"
                        : "hover:bg-black/50 border border-transparent hover:border-orange-500/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                            : "bg-gray-700 group-hover:bg-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-orange-400" : "text-gray-500 group-hover:text-gray-400"
                        }`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-orange-500/20 z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-orange-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  Nexo
                </span>
              </div>
              <button onClick={onToggle} className="text-gray-400 hover:text-white transition-colors duration-300">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-6">
            <div className="space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onTabChange(item.id);
                      onToggle(); 
                    }}
                    className={`w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50"
                        : "hover:bg-black/50 border border-transparent hover:border-orange-500/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                            : "bg-gray-700 group-hover:bg-gray-600"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-orange-400" : "text-gray-500 group-hover:text-gray-400"
                        }`}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
};

type AppBarProps = {
  isWalletConnected: boolean;
  onWalletConnect: () => void;
  onMenuToggle: () => void;
};

export const AppBar = ({ isWalletConnected, onWalletConnect, onMenuToggle }: AppBarProps) => {
  const [walletAddress] = useState("0x4f2a...8c3d");

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/80 backdrop-blur-xl border-b border-orange-500/20 sticky top-0 z-30"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-gray-400 hover:text-white transition-colors duration-300"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Nexo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isWalletConnected ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 rounded-xl px-4 py-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">Connected</div>
                  <div className="text-xs text-gray-400">{walletAddress}</div>
                </div>
                <Wallet className="w-5 h-5 text-orange-400" />
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onWalletConnect}
                className="relative group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  Connect Wallet
                  <Wallet className="w-4 h-4" />
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
