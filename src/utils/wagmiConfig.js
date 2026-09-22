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

// USDC on Celo mainnet, 6 decimals. Verified directly on Celoscan's token
// search (not just docs) — tagged Circle / Stablecoin / Bridged Token:
// https://celoscan.io/token/0xcebA9300f2b948710d2653dD7B07f33A8B32118C
export const USDC_CELO_MAINNET = {
  address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  decimals: 6,
  chainId: celo.id,
};

// cUSD on Celo mainnet, 18 decimals. Celoscan now displays this contract as
// "Mento Dollar (USDm)" after Celo's stablecoin rebrand — same token, same
// contract, just a new display name. Verified on Celoscan's token search:
// https://celoscan.io/token/0x765DE816845861e75A25fCA122bb6898B8B1282A
export const CUSD_CELO_MAINNET = {
  address: "0x765DE816845861e75A25fCA122bb6898B8B1282A",
  decimals: 18,
  chainId: celo.id,
};
