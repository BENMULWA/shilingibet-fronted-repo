
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { imageToWebpPlugin } from "vite-plugin-image-to-webp";

const packageChunkMap = [
  ["antd", "antd"],
  ["@ant-design", "antd"],
  ["rc-", "antd"],
  ["@rc-component", "antd"],
  ["dayjs", "antd"],
  ["react-dom", "react-core"],
  ["react-router-dom", "react-core"],
  ["react/", "react-core"],
  ["scheduler", "react-core"],
  ["@tanstack/react-query", "query-vendor"],
  ["react-hot-toast", "ui-vendor"],
  ["framer-motion", "ui-vendor"],
  ["socket.io-client", "chat-vendor"],
  ["engine.io-client", "chat-vendor"],
  ["socket.io-parser", "chat-vendor"],
  ["moment", "date-vendor"],
  ["lodash", "utils-vendor"],
  ["react-icons", "icons-vendor"],
  ["lucide-react", "icons-vendor"],
  ["iconsax-react", "icons-vendor"],
  ["@heroicons", "icons-vendor"],
  ["@headlessui/react", "ui-primitives"],
  ["react-hook-form", "form-vendor"],
  ["react-turnstile", "security-vendor"],
];

const getVendorChunkName = (id) => {
  if (!id.includes("node_modules")) return null;

  for (const [pkg, chunkName] of packageChunkMap) {
    if (id.includes(pkg)) return chunkName;
  }

  return undefined;
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let proxyTarget = "https://cryptoapis.shilingibet.com";
  let allowedHosts = true;

  try {
    if (env.VITE_API_URL) {
      const parsedApiUrl = new URL(env.VITE_API_URL);
      proxyTarget = parsedApiUrl.origin;
      allowedHosts = [
        parsedApiUrl.hostname,
        ".ngrok.app",
        ".ngrok-free.dev",
        ".ngrok-free.app",
      ];
    }
  } catch {
    proxyTarget = "https://cryptoapis.shilingibet.com";
    allowedHosts = true;
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      imageToWebpPlugin({
        imageFormats: ["jpg", "jpeg", "png"],
        webpQuality: {
          quality: 80,
        },
      }),
    ],

    server: {
      allowedHosts,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    esbuild: {
      drop: ["console", "debugger"],
    },

    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            return getVendorChunkName(id);
          },
        },
      },
      chunkSizeWarningLimit: 500,
      sourcemap: false,
      target: "es2020",
    },

    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
    },
  };
});
