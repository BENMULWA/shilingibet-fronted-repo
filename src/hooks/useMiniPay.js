import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

// Inside MiniPay the wallet is already connected via the injected provider,
// and window.ethereum.isMiniPay is true. Auto-connect on load so the deposit
// UI can skip straight to a "Pay with MiniPay" button instead of showing a
// generic "Connect Wallet" flow (MiniPay's own guidelines require this).
export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const { connect } = useConnect();

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum?.isMiniPay) {
      setIsMiniPay(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, [connect]);

  return isMiniPay;
}
