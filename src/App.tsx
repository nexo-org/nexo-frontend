import { BrowserRouter, Route, Routes } from "react-router-dom";
import StakeCollateral from "./pages/borrow/StakeCollateral";
import LandingPage from "./pages/LandingPage";
import Lend from "./pages/lend/Deposit";
import LendLayout from "./pages/lend/LendLayout";
import Portfolio from "./pages/lend/Portfolio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<LendLayout />}>
          <Route path="/lend/deposit" element={<Lend />} />
          <Route path="/lend/portfolio" element={<Portfolio />} />
        </Route>
        <Route path="/borrow/stake" element={<StakeCollateral />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
