import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LendLayout from "./pages/lend/LendLayout";
import Lend from "./pages/lend/Deposit";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
