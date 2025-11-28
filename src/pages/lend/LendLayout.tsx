import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LoginWithGoogleButton from "../../components/LoginWithGoogleButton";
import { Sidebar } from "../../components/Navigation/LendSidebar";
import { WalletSelector } from "../../components/WalletSelector";

export default function LendLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("deposit")) return "deposit";
    if (path.includes("portfolio")) return "portfolio";
    return "deposit";
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "deposit") {
      navigate("/lend/deposit");
    } else if (tabId === "portfolio") {
      navigate("/lend/portfolio");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-6 right-6 z-50 flex flex-row gap-2">
        <WalletSelector />
        <LoginWithGoogleButton />
      </div>
      <button
        onClick={handleMenuToggle}
        className="fixed top-6 left-6 z-50 lg:hidden bg-black/40 backdrop-blur-xl border border-black/20 rounded-xl p-3 text-gray-400 hover:text-white transition-all duration-300 hover:border-black/40"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex">
        <Sidebar
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          isOpen={isSidebarOpen}
          onToggle={handleMenuToggle}
        />

        <div className="flex-1 min-h-screen">
          <main className="h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
