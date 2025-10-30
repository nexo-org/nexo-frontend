import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BorrowerDashboard from "./pages/borrow/Dashboard";
import PaymentsPage from "./pages/borrow/PaymentsPage";
import StakeCollateral from "./pages/borrow/StakeCollateral";
import LandingPage from "./pages/LandingPage";
import Lend from "./pages/lend/Deposit";
import LendLayout from "./pages/lend/LendLayout";
import Portfolio from "./pages/lend/Portfolio";
import Waitlist from "./pages/Waitlist";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<LendLayout />}>
            <Route path="/lend/deposit" element={<Lend />} />
            <Route path="/lend/portfolio" element={<Portfolio />} />
          </Route>
          <Route path="/borrow" element={<PaymentsPage />} />
          <Route path="/borrow/dashboard" element={<BorrowerDashboard />} />
          <Route path="/borrow/stake" element={<StakeCollateral />} />
          <Route path="/waitlist" element={<Waitlist />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </div>
  );
}

export default App;
