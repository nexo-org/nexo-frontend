import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, DollarSign, Menu, PieChart, Wallet, X } from "lucide-react";

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

      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-gray-50/80 lg:backdrop-blur-xl lg:border-r lg:border-black/20">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-black/20">
            <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-12 h-12 flex items-center justify-center" />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                  Aion
                </span>
              </a>
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
                        ? "bg-gradient-to-r from-black/10 to-gray-700/10 border border-black/40"
                        : "hover:bg-gray-100/50 border border-transparent hover:border-black/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="absolute inset-0 bg-gradient-to-r from-black/5 to-gray-700/5 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-black to-gray-800 shadow-lg shadow-black/30"
                            : "bg-gray-400 group-hover:bg-gray-500"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-black" : "text-gray-600 group-hover:text-black"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-black" : "text-gray-500 group-hover:text-gray-700"
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
        className="fixed left-0 top-0 h-full w-80 bg-gray-50/90 backdrop-blur-xl border-r border-black/20 z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-black to-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-black/30">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                  Aion
                </span>
              </div>
              <button onClick={onToggle} className="text-gray-600 hover:text-black transition-colors duration-300">
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
                        ? "bg-gradient-to-r from-black/10 to-gray-700/10 border border-black/40"
                        : "hover:bg-gray-100/50 border border-transparent hover:border-black/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute inset-0 bg-gradient-to-r from-black/5 to-gray-700/5 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-black to-gray-800 shadow-lg shadow-black/30"
                            : "bg-gray-400 group-hover:bg-gray-500"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={`font-medium transition-colors duration-300 ${
                            isActive ? "text-black" : "text-gray-600 group-hover:text-black"
                          }`}
                        >
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          {item.description}
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive ? "text-black" : "text-gray-500 group-hover:text-gray-700"
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

export const AppBar = ({ onMenuToggle }: AppBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-50/80 backdrop-blur-xl border-b border-black/20 sticky top-0 z-30"
    >
      <div className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden text-gray-600 hover:text-black transition-colors duration-300"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-black to-gray-800 rounded-lg flex items-center justify-center shadow-lg shadow-black/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                Aion
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
