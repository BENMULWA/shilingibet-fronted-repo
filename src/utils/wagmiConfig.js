import { http } from "viem";
import { createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { celo, celoSepolia } from "wagmi/chains";

// MiniPay injects window.ethereum — the injected() connector picks it up
// automatically. Celo Sepolia is included so the app also works while
// MiniPay's Developer Mode "Use Testnet" toggle is on.
export const wagmiConfig = createConfig({
  chains: [celo, celoSepolia],
  connectors: [injected()],
  transports: {
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
});

// USDT on Celo mainnet (42220), 6 decimals.
// See: https://docs.celo.org/build-on-celo/build-on-minipay/overview
export const USDT_CELO_MAINNET = {
  address: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  decimals: 6,
  chainId: celo.id,
};
