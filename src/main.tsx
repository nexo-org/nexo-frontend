import "./polyfills";
import { testPolyfills } from "./test-polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WalletProvider } from "./context/WalletProvider.tsx";

// Test polyfills in development
if (import.meta.env.DEV) {
  testPolyfills();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </StrictMode>
);
