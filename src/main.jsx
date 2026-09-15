import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import App from "./App.jsx";
import "./index.css";
import { BannerProvider } from "./context/BannerContext.jsx";
import { GameProvider } from "./context/GameContext.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { wagmiConfig } from "./utils/wagmiConfig.js";

// Lazy load non-critical components
const Toaster = lazy(() =>
  import("react-hot-toast").then((mod) => ({ default: mod.Toaster })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BannerProvider>
          <GameProvider>
            <ScrollToTop />
            <App />
          </GameProvider>
        </BannerProvider>
      </BrowserRouter>
      <Suspense fallback={null}>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 4000,
              iconTheme: {
                primary: "#facc15",
                secondary: "#000",
              },
              style: {
                fontSize: "14px",
                fontWeight: "600",
                maxWidth: "400px",
                padding: "12px 16px",
                backgroundColor: "#0d1711",
                color: "#fff",
                border: "none",
              },
              className: "toast-success",
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              style: {
                fontSize: "14px",
                fontWeight: "600",
                maxWidth: "400px",
                padding: "12px 16px",
                backgroundColor: "#0d1711",
                color: "#fff",
                border: "none",
              },
              className: "toast-error",
            },
          }}
        />
      </Suspense>
    </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);
