import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { erc20Abi, parseUnits } from "viem";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
// import { successToast } from "../../components/SuccessToast";
import BaseClass from "../../services/BaseClass";
import {
  useDeposit,
  useCeloDeposit,
  useCeloDepositSync,
  useFusionDeposit,
  useCardDeposit,
  useSwitchActiveWallet,
  useUpdateBalance,
} from "../../hooks/usePayment";
import { useMiniPay } from "../../hooks/useMiniPay";
import { USDT_CELO_MAINNET } from "../../utils/wagmiConfig";
import { BsInfoCircle } from "react-icons/bs";

const CELO_DEPOSIT_ASSETS = ["USDT", "USDC", "cUSD"];

const depositAmounts = [
  { value: 49, hot: false },
  { value: 100, hot: true },
  { value: 500, hot: true },
  { value: 1000, hot: true },
  { value: 2000, hot: true },
  { value: 3000, hot: true },
  { value: 4000, hot: true },
  { value: 5000, hot: true },
  { value: 10000, hot: false },
];

const SHOW_CRYPTO_UI = true;
// Card checkout is fully supported but hidden on deployments used for the
// MiniPay tester demo (set VITE_SHOW_CARD_PAYMENT=false there) so testers
// only see the three channels relevant to them: Mobile Money, Crypto/MiniPay,
// and Fusion Fi. Left enabled everywhere else, local included.
const SHOW_CARD_UI = import.meta.env.VITE_SHOW_CARD_PAYMENT !== "false";

const getHostedCheckoutUrl = (response) => {
  const candidates = [
    response?.redirectUrl,
    response?.redirect_url,
    response?.checkout_url,
    response?.checkoutUrl,
    response?.payment_url,
    response?.paymentUrl,
    response?.url,
    response?.link,
    response?.provider?.checkout_url,
    response?.provider?.checkoutUrl,
    response?.provider?.redirect_url,
    response?.provider?.redirectUrl,
    response?.provider?.payment_url,
    response?.provider?.paymentUrl,
    response?.provider?.url,
    response?.provider?.link,
    response?.provider?.order?.checkout_url,
    response?.provider?.order?.checkoutUrl,
    response?.provider?.order?.redirect_url,
    response?.provider?.order?.redirectUrl,
    response?.provider?.order?.payment_url,
    response?.provider?.order?.paymentUrl,
    response?.provider?.order?.url,
    response?.provider?.order?.link,
    response?.order?.checkout_url,
    response?.order?.checkoutUrl,
    response?.order?.redirect_url,
    response?.order?.redirectUrl,
    response?.order?.payment_url,
    response?.order?.paymentUrl,
    response?.order?.url,
    response?.order?.link,
    response?.data?.redirectUrl,
    response?.data?.redirect_url,
    response?.data?.checkout_url,
    response?.data?.checkoutUrl,
    response?.data?.payment_url,
    response?.data?.paymentUrl,
    response?.data?.url,
    response?.data?.link,
    response?.data?.provider?.redirectUrl,
    response?.data?.provider?.redirect_url,
    response?.data?.provider?.checkout_url,
    response?.data?.provider?.checkoutUrl,
    response?.data?.provider?.payment_url,
    response?.data?.provider?.paymentUrl,
    response?.data?.provider?.url,
    response?.data?.provider?.link,
    response?.data?.provider?.order?.redirectUrl,
    response?.data?.provider?.order?.redirect_url,
    response?.data?.provider?.order?.checkout_url,
    response?.data?.provider?.order?.checkoutUrl,
    response?.data?.provider?.order?.payment_url,
    response?.data?.provider?.order?.paymentUrl,
    response?.data?.provider?.order?.url,
    response?.data?.provider?.order?.link,
  ];

  return candidates.find(
    (value) => typeof value === "string" && /^https?:\/\//i.test(value)
  );
};

export default function Deposit() {
  const baseClass = new BaseClass();

  const [tab, setTab] = useState("mobile"); // "mobile" | "crypto" | "comet"
  const [copied, setCopied] = useState(false);

  // Fusion Fi state
  const [fusionEmail, setFusionEmail] = useState("");
  const [fusionAmount, setFusionAmount] = useState("");
  const [cardEmail, setCardEmail] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(
    baseClass.activeWallet || "balance"
  );
  const [cryptoAsset, setCryptoAsset] = useState("USDT");
  const [miniPayAmount, setMiniPayAmount] = useState("");

  const isMiniPay = useMiniPay();
  const { address: connectedAddress } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const {
    writeContract,
    data: miniPayTxHash,
    isPending: isMiniPaySending,
    reset: resetMiniPayWrite,
  } = useWriteContract();

  const { makingPayment, isLoading } = useDeposit();
  const {
    depositAddress: cryptoDeposit,
    isLoading: isCryptoAddressLoading,
    isFetching: isCryptoAddressFetching,
    error: cryptoAddressError,
    refetch: refetchCryptoAddress,
  } = useCeloDeposit(cryptoAsset, SHOW_CRYPTO_UI && tab === "crypto");
  const { depositViaFusion, isLoading: isFusionLoading } = useFusionDeposit();
  const { createCardPaymentLink, isLoading: isCardLoading } = useCardDeposit();
  const { balance: walletState } = useUpdateBalance();
  const { syncCeloDeposit, isLoading: isCeloSyncing } = useCeloDepositSync();
  const { switchActiveWallet, isLoading: isSwitchingWallet } = useSwitchActiveWallet();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { amount: 49 },
    mode: "onTouched",
  });

  const amount = Number(watch("amount") || 0);
  const tax = amount * 0.05;
  const netAmount = amount - tax;
  const disabled = isLoading || isSubmitting;

  useEffect(() => {
    if (baseClass.email) {
      setFusionEmail((current) => current || baseClass.email);
      setCardEmail((current) => current || baseClass.email);
    }
  }, [baseClass.email]);

  useEffect(() => {
    setSelectedWallet(walletState?.activeWallet || baseClass.activeWallet || "balance");
  }, [walletState?.activeWallet, baseClass.activeWallet]);

  const handlePresetClick = (val) => {
    setValue("amount", val, { shouldValidate: true });
  };

  const handleWalletChange = (wallet) => {
    if (!wallet || wallet === selectedWallet || isSwitchingWallet) {
      return;
    }

    setSelectedWallet(wallet);
    switchActiveWallet(wallet, {
      onError: () => {
        setSelectedWallet(walletState?.activeWallet || baseClass.activeWallet || "balance");
      },
    });
  };

  const onSubmit = ({ amount }) => {
    const phone = baseClass?.phone;
    const userID = baseClass?.userId;

    makingPayment(
      { amount: Number(amount), phone, userID, walletType: selectedWallet },
      {
        onSuccess: () => {
          reset({ amount: 49 });
        },
      }
    );
  };

  const handleCopy = () => {
    if (!cryptoDeposit?.address) return;
    navigator.clipboard.writeText(cryptoDeposit.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckCryptoDeposit = async () => {
    try {
      const result = await syncCeloDeposit(cryptoAsset);
      if (result?.credited > 0) {
        toast.success(`Credited KES ${result.credited.toLocaleString()} from your ${cryptoAsset} deposit!`);
      } else {
        toast.success("No new deposit found yet. Once your transfer confirms on-chain, try again.");
      }
    } catch (error) {
      toast.error(error?.message || "Couldn't check for new deposits. Please try again.");
    }
  };

  const handleMiniPaySend = () => {
    if (cryptoAsset !== "USDT") {
      toast.error("Pay with MiniPay currently only supports USDT.");
      return;
    }

    if (!cryptoDeposit?.address) {
      toast.error("Deposit address isn't ready yet.");
      return;
    }

    const amountNum = Number(miniPayAmount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter an amount to send.");
      return;
    }

    if (chainId !== USDT_CELO_MAINNET.chainId) {
      toast.error(
        "MiniPay is on a different network. Turn off Developer Mode's \"Use Testnet\" toggle to send real USDT, then try again."
      );
      return;
    }

    writeContract({
      address: USDT_CELO_MAINNET.address,
      abi: erc20Abi,
      functionName: "transfer",
      args: [cryptoDeposit.address, parseUnits(miniPayAmount, USDT_CELO_MAINNET.decimals)],
      chainId: USDT_CELO_MAINNET.chainId,
    });
  };

  useEffect(() => {
    if (miniPayTxHash) {
      toast.success("Sent! Waiting for on-chain confirmation before your balance updates.");
      setMiniPayAmount("");
      resetMiniPayWrite();
    }
  }, [miniPayTxHash, resetMiniPayWrite]);

  const handleFusionDeposit = () => {
    const email = fusionEmail.trim();
    const amountNum = Number(fusionAmount);

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid Fusion Fi email");
      return;
    }

    if (!amountNum || amountNum < 10) {
      toast.error("Minimum Fusion Fi deposit is KES 10");
      return;
    }

    depositViaFusion(
      {
        amount: amountNum,
        email,
        currency: "KES",
        comment: `shilingibet-deposit-${baseClass.userId || "guest"}`,
        description: "ShilingiBet wallet deposit",
      },
      {
        onSuccess: (response) => {
          setFusionAmount("");

          const checkoutUrl = getHostedCheckoutUrl(response);
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }

          toast.success(
            "Fusion Fi order created. Complete the payment from the provider page once it becomes available."
          );
        },
      }
    );
  };

  const handleCardDeposit = () => {
    const email = cardEmail.trim();
    const amountNum = Number(cardAmount);

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!amountNum || amountNum < 1) {
      toast.error("Minimum card deposit is USD 1");
      return;
    }

    createCardPaymentLink(
      {
        amount: amountNum,
        email,
        currency: "USD",
        country: "US",
        phone: baseClass.phone,
        firstName: baseClass.firstName,
        lastName: baseClass.lastName,
        description: "Wallet top-up",
        externalRef: `deposit-${baseClass.userId || "guest"}-${Date.now()}`,
        redirectUrl: `${window.location.origin}/deposit`,
        walletType: selectedWallet,
      },
      {
        onSuccess: (response) => {
          const checkoutUrl = getHostedCheckoutUrl(response);

          if (!checkoutUrl) {
            toast.error("Payment link was created but no redirect URL was returned");
            return;
          }

          setCardAmount("");
          window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        },
      }
    );
  };

  return (
    <div className="md:min-h-screen text-[#b7c4ba] flex justify-center px-3 md:px-4 py-4 md:py-6">
      <div className="w-full max-w-md md:max-w-5xl md:bg-surface/80 rounded-xl overflow-hidden shadow-lg border border-white/5">

        {/* Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          <header>
            <h1 className="text-xl md:text-2xl font-semibold text-white">Deposit</h1>
            <p className="text-xs md:text-sm text-[#9cae9f] mt-1">
              Choose your preferred payment method
            </p>
          </header>

          <section className="rounded-2xl border border-primary/20 bg-[#07110b]/85 p-4 md:p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Deposit wallet</h2>
                <p className="text-xs text-[#9cae9f]">
                  Choose which wallet should receive this deposit and be used by default.
                </p>
              </div>
              {isSwitchingWallet && (
                <span className="text-xs text-primary">Updating...</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleWalletChange("balance")}
                disabled={isSwitchingWallet}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedWallet === "balance"
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-white/10 bg-background/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Main Wallet</p>
                    <p className="text-xs text-[#9cae9f]">KES {(walletState?.balance ?? baseClass.user?.balance ?? 0).toLocaleString()}</p>
                  </div>
                  {selectedWallet === "balance" && (
                    <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-black">
                      Active
                    </span>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleWalletChange("airtime")}
                disabled={isSwitchingWallet}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedWallet === "airtime"
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : "border-white/10 bg-background/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Airtime Wallet</p>
                    <p className="text-xs text-[#9cae9f]">KES {(walletState?.airtimeBalance ?? baseClass.airtimeBalance ?? 0).toLocaleString()}</p>
                  </div>
                  {selectedWallet === "airtime" && (
                    <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-black">
                      Active
                    </span>
                  )}
                </div>
              </button>
            </div>
          </section>

          {/* Tab Selector */}
          <div className="flex gap-2 md:gap-3 bg-background/70 p-1 md:p-1.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setTab("mobile")}
              className={`flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                tab === "mobile"
                  ? "bg-primary text-black shadow-md"
                  : "text-[#9cae9f] hover:text-white"
              }`}
            >
              Mobile Money
            </button>
            {SHOW_CRYPTO_UI && (
              <button
                type="button"
                onClick={() => setTab("crypto")}
                className={`relative flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                  tab === "crypto"
                    ? "bg-primary text-black shadow-md"
                    : "text-[#9cae9f] hover:text-white"
                }`}
              >
                Crypto (USDT)
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold align-middle ${
                    tab === "crypto" ? "bg-black/15 text-black" : "bg-primary/20 text-primary"
                  }`}
                >
                  MiniPay
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setTab("comet")}
              className={`flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                tab === "comet"
                  ? "bg-primary text-black shadow-md"
                  : "text-[#9cae9f] hover:text-white"
              }`}
            >
              Fusion Fi
            </button>
            {SHOW_CARD_UI && (
              <button
                type="button"
                onClick={() => setTab("card")}
                className={`flex-1 py-2 md:py-2.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                  tab === "card"
                    ? "bg-primary text-black shadow-md"
                    : "text-[#9cae9f] hover:text-white"
                }`}
              >
                Pay With Card
              </button>
            )}
          </div>

          {SHOW_CRYPTO_UI && !SHOW_CARD_UI && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-xs text-[#b7c4ba]">
              <span className="font-semibold text-primary">MiniPay testers:</span>{" "}
              use the <span className="font-semibold text-primary">Crypto (USDT)</span> tab above to deposit
              directly from your MiniPay wallet on the Celo network.
            </div>
          )}

          {/* MOBILE MONEY TAB */}
          {tab === "mobile" && (
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <p className="text-sm text-[#b7c4ba] mb-4">
                  Choose an amount or enter manually
                </p>

                {/* Amount Input */}
                <input
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={140000}
                  placeholder="Amount (KES)"
                  className="w-full rounded-lg px-5 border border-primary/80 bg-[#07110b] py-3 text-white focus:outline-primary focus:ring-0 focus:border-primary placeholder:text-[#9cae9f]"
                  {...register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: { value: 10, message: "Minimum deposit is KES 10" },
                    max: {
                      value: 140000,
                      message: "Maximum deposit is KES 140,000",
                    },
                  })}
                  disabled={disabled}
                />
                {errors.amount && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Preset Amounts */}
              <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                {depositAmounts.map(({ value, hot }) => {
                  const active = amount === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handlePresetClick(value)}
                      disabled={disabled}
                      className={`relative overflow-hidden rounded-lg border bg-[#0b120e] transition-all duration-200 hover:border-primary/60 hover:bg-[#0f1b13]
                        ${
                          active
                            ? "border-primary ring-2 ring-primary/35"
                            : "border-primary/20"
                        }
                      `}
                    >
                      <div className="relative px-4 py-3 text-center">
                        <span className="text-md font-semibold text-[#d7e1d9]">
                          {value}
                        </span>
                        {hot && (
                          <span className="absolute right-2 top-2 text-lg">
                            🔥
                          </span>
                        )}
                      </div>

                      <div className={`py-2 text-center font-medium text-sm transition-colors ${
                        active
                          ? "bg-primary text-black"
                          : "bg-primary/10 text-primary"
                      }`}>
                        Pay {value}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pay CTA */}
              <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-md bg-primary py-4 text-lg font-bold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {disabled ? "Processing…" : `Pay KES ${amount}`}
              </button>

              {/* Summary */}
              <div className="rounded-xl border border-primary/20 bg-[#07110b]/85 p-4 text-sm space-y-3">
                <p className="text-xs text-[#b7c4ba]">
                  A <span className="font-semibold text-primary">5% tax</span>{" "}
                  will be deducted from your deposit amount
                </p>

                <div className="flex justify-between">
                  <span>Deposit Amount</span>
                  <span className="text-green-500">KES {amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="text-red-400">- KES {tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-primary/20 pt-3 flex justify-between font-semibold">
                  <span className="text-primary">Amount to Wallet</span>
                  <span className="text-primary">
                    KES {netAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* FUSION FI TAB */}
          {tab === "comet" && (
            <div className="space-y-6">
              {/* Fusion Fi Logo / Header */}
              <div className="flex flex-col items-center gap-3 bg-background/60 border border-white/10 rounded-2xl p-6">
                <img
                  src="/fusion.png"
                  alt="Fusion Fi"
                  className="h-24 w-24 object-contain"
                />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#d7e1d9]">Fusion Fi</h3>
                  <p className="text-xs text-[#75877a] mt-0.5">
                    Create a hosted bill order and complete payment on Fusion Fi
                  </p>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs md:text-sm text-[#9cae9f] mb-2">
                  Fusion Fi Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your Fusion Fi email"
                  value={fusionEmail}
                  onChange={(e) => setFusionEmail(e.target.value)}
                  className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-transparent text-[#d7e1d9] focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs md:text-sm text-[#9cae9f] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (KES)"
                  value={fusionAmount}
                  onChange={(e) => setFusionAmount(e.target.value)}
                  min={10}
                  className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-transparent text-[#d7e1d9] focus:outline-none focus:border-primary transition"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleFusionDeposit}
                disabled={isFusionLoading}
                className="w-full rounded-lg bg-primary py-4 text-lg font-bold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {isFusionLoading ? "Processing…" : "Continue to Fusion Fi"}
              </button>

              {/* Info */}
              <div className="rounded-sm bg-background/60 p-4 text-sm text-textColor/80 space-y-3">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    The backend contract creates a pending Fusion Fi bill order
                    first. Your wallet is credited only after the provider side
                    is completed and reconciled.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Make sure you use your registered{" "}
                    <span className="font-semibold text-primary">Fusion Fi email</span>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {SHOW_CARD_UI && tab === "card" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3 bg-background/60 border border-white/10 rounded-2xl p-6">
                <div className="flex h-35 w-60 items-center justify-center rounded-2xl text-3xl text-primary">
                  <img src="/card.png"></img>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#d7e1d9]">Card Payment</h3>
                  <p className="text-xs text-[#75877a] mt-0.5">
                    Generate a hosted wallet top-up link and finish payment on the provider page
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-[#9cae9f] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={cardEmail}
                  onChange={(e) => setCardEmail(e.target.value)}
                  className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-transparent text-[#d7e1d9] focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-[#9cae9f] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (USD)"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  min={1}
                  className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-transparent text-[#d7e1d9] focus:outline-none focus:border-primary transition"
                />
              </div>

              <button
                type="button"
                onClick={handleCardDeposit}
                disabled={isCardLoading}
                className="w-full rounded-lg bg-primary py-4 text-lg font-bold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                {isCardLoading ? "Generating link…" : "Continue to Card Checkout"}
              </button>

              <div className="rounded-sm bg-background/60 p-4 text-sm text-textColor/80 space-y-3">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    This flow now calls our backend `wallet/card-link` endpoint and then redirects you to the hosted checkout link it returns.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Card payments are sent in USD using your account email and phone details for the wallet top-up request.
                  </p>
                </div>
              </div>
            </div>
          )}

          {SHOW_CRYPTO_UI && tab === "crypto" && (
            <div className="bg-background/60 border border-primary/20 rounded-2xl p-4 md:p-6 space-y-6 md:space-y-8">
              {/* Asset selector */}
              <div>
                <p className="text-sm text-[#b7c4ba] mb-3">
                  Deposit a stablecoin on the Celo network. It's swept and
                  credited to your wallet in KES automatically.
                </p>
                <div className="flex rounded-lg overflow-hidden border border-primary/30">
                  {CELO_DEPOSIT_ASSETS.map((asset, idx) => (
                    <button
                      type="button"
                      key={asset}
                      onClick={() => setCryptoAsset(asset)}
                      className={`flex-1 py-2 text-sm font-medium transition-all
                        ${cryptoAsset === asset ? "bg-primary text-black" : "bg-secondary text-[#b7c4ba]"}
                        ${idx !== CELO_DEPOSIT_ASSETS.length - 1 ? "border-r border-primary/30" : ""}`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 1: deposit address */}
              <div>
                <div className="flex items-start md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-primary text-black font-bold text-base md:text-lg flex-shrink-0">
                    1
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#d7e1d9] leading-tight">
                    Send {cryptoAsset} (Celo network) to your address:
                  </h3>
                </div>

                {isCryptoAddressLoading && (
                  <div className="flex items-center justify-center py-10">
                    <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                  </div>
                )}

                {cryptoAddressError && !isCryptoAddressLoading && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {cryptoAddressError.message || "Couldn't load your deposit address. Please try again."}
                    <button
                      type="button"
                      onClick={() => refetchCryptoAddress()}
                      className="ml-2 underline underline-offset-2 hover:text-red-200"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {!isCryptoAddressLoading && !cryptoAddressError && cryptoDeposit?.address && isMiniPay && (
                  <div className="mb-4 rounded-lg border border-primary/40 bg-secondary p-3 md:p-4 space-y-3">
                    <p className="text-xs md:text-sm text-primary font-semibold">
                      MiniPay detected — pay directly, no QR needed
                    </p>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder={`Amount (${cryptoAsset})`}
                      value={miniPayAmount}
                      onChange={(e) => setMiniPayAmount(e.target.value)}
                      className="w-full rounded-lg px-4 py-2.5 border border-primary/40 bg-background/40 text-white placeholder:text-[#6f7f73] focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={handleMiniPaySend}
                      disabled={isMiniPaySending || isSwitchingChain || !connectedAddress}
                      className="w-full py-3 bg-primary text-black text-sm font-semibold rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isMiniPaySending ? "Confirm in MiniPay…" : `Pay with MiniPay`}
                    </button>
                    {chainId && chainId !== USDT_CELO_MAINNET.chainId && (
                      <p className="text-xs text-amber-300">
                        MiniPay is on testnet (Developer Mode). Turn off "Use Testnet" to send real USDT that gets credited.{" "}
                        <button
                          type="button"
                          onClick={() => switchChain({ chainId: USDT_CELO_MAINNET.chainId })}
                          className="underline underline-offset-2"
                        >
                          Try switching network
                        </button>
                      </p>
                    )}
                  </div>
                )}

                {!isCryptoAddressLoading && !cryptoAddressError && cryptoDeposit?.address && (
                  <>
                    <div className="flex justify-center bg-white rounded-lg p-4 mb-4">
                      <QRCodeSVG value={cryptoDeposit.address} size={176} />
                    </div>

                    <div className="flex items-center gap-2 bg-secondary border border-primary/40 rounded-lg px-3 md:px-4 py-2.5 md:py-3.5">
                      <span className="break-all text-primary font-mono text-xs md:text-sm flex-1 min-w-0">
                        {cryptoDeposit.address}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-primary hover:text-primary/80 transition flex-shrink-0"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <ul className="list-disc list-inside mt-3 md:mt-4 text-xs md:text-sm text-[#9cae9f] space-y-1 md:space-y-1.5">
                      <li className="break-words">
                        Open MiniPay (or scan the QR from any Celo wallet) and send{" "}
                        {cryptoAsset} on the <span className="font-semibold text-primary">Celo network</span> only.
                      </li>
                      <li className="break-words">
                        This is your permanent {cryptoAsset} deposit address — reuse it any time.
                      </li>
                      <li className="break-words">
                        Sending on any other network (e.g. Tron/TRC20, Ethereum) will not be credited.
                      </li>
                    </ul>
                  </>
                )}
              </div>

              {/* Step 2: confirmation */}
              <div>
                <div className="flex items-start md:items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-primary text-black font-bold text-base md:text-lg flex-shrink-0">
                    2
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-[#d7e1d9] leading-tight">
                    Wait for automatic credit
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-[#9cae9f] mb-4">
                  No transaction ID needed — once your transfer confirms on-chain
                  it's swept and your KES balance updates on its own.
                </p>

                <button
                  type="button"
                  onClick={handleCheckCryptoDeposit}
                  disabled={isCryptoAddressFetching || isCeloSyncing}
                  className="w-full py-3 md:py-3.5 bg-primary text-black text-sm md:text-base font-semibold rounded-lg hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isCryptoAddressFetching || isCeloSyncing ? "animate-spin" : ""}`} />
                  I've sent it — check my balance
                </button>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3 md:p-4">
                <p className="text-xs text-[#aab8ad] leading-relaxed break-words">
                  <span className="font-semibold text-primary">Note:</span> Your
                  balance is credited at the live {cryptoAsset}/KES rate once the
                  deposit is confirmed on-chain. This usually takes a few minutes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
