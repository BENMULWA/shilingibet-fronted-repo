import { useState } from "react";
import BaseClass from "../../services/BaseClass";
import {
  useUpdateBalance,
  useWithdraw,
  useWithdrawCrypto,
} from "../../hooks/usePayment";
import { BsInfoCircle, BsCheckCircleFill } from "react-icons/bs";
import { SiTether } from "react-icons/si";
import toast from "react-hot-toast";
import { debouncedWithdraw } from "../../utils/debounce";
import { normalizeKenyanPhone } from "../../utils/phone";

const SHOW_CRYPTO_UI = true;
// Comet App withdrawal is temporarily switched off for the MiniPay tester
// rollout, same as the Deposit page — testers should only see M-Pesa and
// Crypto right now. Nothing below was deleted, just hidden: flip this back
// to `true` once Comet withdrawal is ready, no other changes needed.
const SHOW_COMET_UI = false;
const TABS = [
  "M-Pesa",
  ...(SHOW_CRYPTO_UI ? ["Crypto"] : []),
  ...(SHOW_COMET_UI ? ["Comet App"] : []),
];
// Lowered from 1 for staging testing only — the backend has no minimum of
// its own for crypto withdrawals (celoWithdraw just requires amount > 0 and
// sufficient balance), so this is a pure UI guard. Restore to 1 before
// pointing this build at production.
const MIN_CRYPTO_WITHDRAWAL = 0.25;
const CELO_WITHDRAW_ASSETS = ["USDT", "USDC", "cUSD"];
const CELO_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function isValidCeloAddress(address) {
  return CELO_ADDRESS_REGEX.test(address.trim());
}

export default function Withdraw() {
  const [activeTab, setActiveTab] = useState("M-Pesa");
  const [selectedWallet, setSelectedWallet] = useState("balance");
  const [airtimePhone, setAirtimePhone] = useState("");

  // M-Pesa state
  // TEMP: minimum lowered 100 -> 10 for testing, revert after (search MIN_WITHDRAWAL_TEST)
  const [amount, setAmount] = useState(10); // MIN_WITHDRAWAL_TEST
  const tax = amount * 0.05;
  const fee = 0;
  const disbursed = amount - tax - fee;

  // Crypto state
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoAsset, setCryptoAsset] = useState("USDT");

  // Comet App state
  const [cometEmail, setCometEmail] = useState("");
  const [cometWithdrawAmount, setCometWithdrawAmount] = useState("");

  const baseClass = new BaseClass();
  const phone = baseClass?.phone;

  const { balance } = useUpdateBalance();
  const { withdrawingCash, isLoading: isWithdrawing } = useWithdraw();
  const { withdrawCrypto, isLoading: isCryptoWithdrawing, data: cryptoResult, reset: resetCrypto } = useWithdrawCrypto();
  const cryptoAmountNumber = Number(cryptoAmount);
  const activeWithdrawWallet =
    selectedWallet || balance?.activeWallet || baseClass.activeWallet || "balance";
  const withdrawableBalance =
    activeWithdrawWallet === "airtime"
      ? Number(balance?.airtimeBalance ?? baseClass.airtimeBalance ?? 0)
      : Number(balance?.balance ?? baseClass.user?.balance ?? 0);
  const canSubmitCryptoWithdrawal =
    isValidCeloAddress(cryptoAddress) &&
    cryptoAmountNumber >= MIN_CRYPTO_WITHDRAWAL &&
    !isCryptoWithdrawing;

  const walletLabel =
    activeWithdrawWallet === "airtime" ? "Airtime Wallet" : "Main Wallet";
  const normalizedAirtimePhone = normalizeKenyanPhone(airtimePhone);
  const submitPhone =
    activeWithdrawWallet === "airtime" ? normalizedAirtimePhone : phone;

  const handleWalletChange = (wallet) => {
    if (!wallet) return;
    setSelectedWallet(wallet);
  };

  const withdrawalActionLabel =
    activeWithdrawWallet === "airtime" ? "Withdraw Airtime" : "Withdraw";

  // ── M-Pesa handler ──────────────────────────────────────────────────────────
  function handleWithdraw() {
    debouncedWithdraw(amount, () => {
      if (isWithdrawing) return;

      if (!withdrawableBalance || withdrawableBalance === 0) {
        return toast.error("You don't have enough amount to make this transaction");
      }

      if (+amount > withdrawableBalance) {
        return toast.error("You don't have enough amount to make this transaction");
      }

      if (+amount < 10) { // MIN_WITHDRAWAL_TEST
        return toast.error("Withdrawals start at Ksh 10 and above.");
      }

      if (activeWithdrawWallet === "airtime" && !airtimePhone.trim()) {
        return toast.error("Please enter the telecom number for airtime withdrawal.");
      }

      withdrawingCash(
        {
          withdrawAmount: amount,
          walletType: activeWithdrawWallet,
          phone: submitPhone,
        },
        {
          onSuccess: () => {
            setAmount(10); // MIN_WITHDRAWAL_TEST
            if (activeWithdrawWallet === "airtime") {
              setAirtimePhone("");
            }
          },
          onError: (err) => {
            toast.error(err?.message || `Withdrawal of Ksh ${amount} failed`);
          },
        }
      );
    });
  }

  // ── Crypto handler ───────────────────────────────────────────────────────────
  function handleCryptoWithdraw() {
    if (!cryptoAddress.trim()) {
      return toast.error("Please enter a valid Celo wallet address.");
    }
    if (!isValidCeloAddress(cryptoAddress)) {
      return toast.error("Celo wallet address must be a valid 0x... address.");
    }
    if (!cryptoAmount || cryptoAmountNumber < MIN_CRYPTO_WITHDRAWAL) {
      return toast.error(`Minimum withdrawal is ${MIN_CRYPTO_WITHDRAWAL} ${cryptoAsset} on minipay external wallet.`);
    }
    withdrawCrypto({
      amount: cryptoAmountNumber,
      toAddress: cryptoAddress.trim(),
      asset: cryptoAsset,
    });
  }

  function handleCryptoReset() {
    setCryptoAddress("");
    setCryptoAmount("");
    resetCrypto();
  }

  // ── Crypto result screen ─────────────────────────────────────────────────────
  // A result only ever lands here via onSuccess (see useWithdrawCrypto) — a
  // rejected/failed withdrawal never debits the wallet and surfaces as a
  // toast instead, so this screen is always the "success" case.
  if (SHOW_CRYPTO_UI && activeTab === "Crypto" && cryptoResult) {
    const txStatus = cryptoResult?.transaction?.status;
    const isPendingOnChain = txStatus === "pending";

    return (
      <div className="text-[#b7c4ba] flex justify-center p-4">
        <div className="w-full max-w-md md:max-w-5xl bg-surface/80 rounded-2xl shadow-xl overflow-hidden border border-white/5">
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <BsCheckCircleFill className="text-6xl text-green-400" />

            <h2 className="text-2xl font-bold text-green-400">
              Withdrawal {isPendingOnChain ? "Submitted" : "Sent"}
            </h2>

            <p className="text-textColor/70 text-sm">
              {cryptoResult?.provider?.message ||
                "Your withdrawal was broadcast to the Celo network."}
            </p>

            <div className="w-full rounded-lg bg-[#07110b]/85 border border-primary/20 p-4 text-sm space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-textColor/70">Amount</span>
                <span className="font-semibold text-primary">
                  {cryptoResult?.amountUsdc} {cryptoAsset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-textColor/70">Rate</span>
                <span>1 {cryptoAsset} = KES {cryptoResult?.rate?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textColor/70">KES Debited</span>
                <span className="font-semibold text-primary">
                  KES {cryptoResult?.debitAmountKes?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-textColor/70">Network</span>
                <span>Celo Mainnet</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-textColor/70 shrink-0">To address</span>
                <span className="break-all text-right text-xs">
                  {cryptoResult?.transaction?.providerResponse?.toAddress}
                </span>
              </div>
              {cryptoResult?.provider?.tx_hash && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-textColor/70 shrink-0">Tx Hash</span>
                  <span className="break-all text-right text-xs">
                    {cryptoResult.provider.tx_hash}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-textColor/70">Status</span>
                <span className="capitalize">{txStatus || "pending"}</span>
              </div>
            </div>

            <button
              onClick={handleCryptoReset}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold"
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[#b7c4ba] flex justify-center p-4">
      <div className="w-full max-w-md md:max-w-5xl bg-surface/80 rounded-2xl shadow-xl overflow-hidden border border-white/5">

        {/* Content */}
        <main className="p-6 md:p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-white">Withdraw</h1>

          <p className="text-primary font-semibold">
            {walletLabel} Withdrawable (KES) :{" "}
            {withdrawableBalance.toLocaleString()}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 bg-background/70 p-1 rounded-lg border border-white/10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-black"
                    : "text-[#9cae9f] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!SHOW_COMET_UI && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-xs text-[#b7c4ba]">
              <span className="font-semibold text-primary">Two ways to withdraw right now:</span>{" "}
              <span className="font-semibold text-primary">M-Pesa</span> or{" "}
              <span className="font-semibold text-primary">Crypto (USDT/USDC/cUSD)</span> to your
              own Celo wallet. Comet App withdrawal is coming soon.
            </div>
          )}

          {/* ── M-Pesa Tab ─────────────────────────────────────────────────── */}
          {activeTab === "M-Pesa" && (
            <>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#07110b]/85 border border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => handleWalletChange("balance")}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    activeWithdrawWallet === "balance"
                      ? "bg-primary text-black"
                      : "border border-white/10 bg-background/40 text-white"
                  }`}
                >
                  Main Wallet
                  <span className="mt-1 block text-xs font-normal opacity-80">
                    KES {Number(balance?.balance ?? baseClass.user?.balance ?? 0).toLocaleString()}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWalletChange("airtime")}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    activeWithdrawWallet === "airtime"
                      ? "bg-primary text-black"
                      : "border border-white/10 bg-background/40 text-white"
                  }`}
                >
                  Airtime Wallet
                  <span className="mt-1 block text-xs font-normal opacity-80">
                    KES {Number(balance?.airtimeBalance ?? baseClass.airtimeBalance ?? 0).toLocaleString()}
                  </span>
                </button>
              </div>

              {activeWithdrawWallet === "airtime" ? (
                <input
                  type="tel"
                  value={airtimePhone}
                  onChange={(e) => setAirtimePhone(e.target.value)}
                  className="w-full rounded-lg px-5 py-3 border border-primary/40 bg-[#07110b] text-white placeholder:text-[#9cae9f] focus:outline-none focus:border-primary"
                  placeholder="Enter telecom number for airtime"
                />
              ) : (
                <input
                  type="text"
                  value={`MPESA Number: ${phone}`}
                  readOnly
                  disabled
                  className="w-full border border-white/10 bg-[#07110b] rounded-lg px-5 py-3 text-[#8fb79c] cursor-not-allowed opacity-80"
                />
              )}

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg px-5 py-3 border border-primary/40 bg-[#07110b] text-white placeholder:text-[#9cae9f] focus:outline-none focus:border-primary"
                placeholder="Amount (KES)"
              />

              <div className="rounded-lg bg-[#07110b]/85 border border-primary/20 p-4 text-sm space-y-3">
                <p className="text-xs text-[#b7c4ba]">
                  Withholding Tax{" "}
                  <span className="font-semibold text-primary">5%</span>
                </p>

                <div className="flex justify-between">
                  <span>Withdraw Amount</span>
                  <span>KES {amount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax Amount</span>
                  <span className="text-red-400">- KES {tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Withdraw Fee</span>
                  <span className="text-red-400">- KES {fee}</span>
                </div>

                <div className="border-t border-primary/20 pt-3 flex justify-between font-semibold">
                  <span className="text-primary">Disbursed Amount</span>
                  <span className="text-primary">KES {disbursed.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={isWithdrawing}
                className="w-full bg-primary text-black py-4 rounded-lg text-lg font-bold disabled:opacity-60"
              >
                {isWithdrawing ? "Processing..." : withdrawalActionLabel}
              </button>

              <div className="rounded-sm bg-[#07110b]/85 border border-white/5 p-4 text-sm text-[#b7c4ba] space-y-3">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Withdrawal range is{" "}
                    <span className="font-semibold text-primary">KES 10 – 70,000</span>. {/* MIN_WITHDRAWAL_TEST */}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Cash withdrawal uses only your saved M-Pesa number, while airtime withdrawal uses the telecom number you enter here.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Funds are credited{" "}
                    <span className="font-semibold text-primary">instantly</span> to Mpesa.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── Comet App Tab ──────────────────────────────────────────────── */}
          {SHOW_COMET_UI && activeTab === "Comet App" && (
            <>
              {/* Comet App Logo / Header */}
              <div className="flex flex-col items-center gap-3 bg-[#07110b]/85 border border-white/10 rounded-2xl p-6">
                <img
                  src="/Comet Logo.png"
                  alt="Comet App"
                  className="w-20 h-20 object-contain"
                />
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#d7e1d9]">Comet App</h3>
                  <p className="text-xs text-[#75877a] mt-0.5">Withdraw directly to your Comet account</p>
                </div>
              </div>

              <input
                type="email"
                value={cometEmail}
                onChange={(e) => setCometEmail(e.target.value)}
                className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-[#07110b] text-white focus:outline-none focus:border-primary"
                placeholder="Enter your Comet App email"
              />

              <input
                type="number"
                value={cometWithdrawAmount}
                onChange={(e) => setCometWithdrawAmount(e.target.value)}
                min={1}
                className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-[#07110b] text-white focus:outline-none focus:border-primary"
                placeholder="Enter amount (KES)"
              />

              <button
                type="button"
                onClick={() => toast("Comet App withdrawal coming soon!", { icon: "🚀" })}
                className="w-full bg-primary text-black py-4 rounded-lg text-lg font-bold"
              >
                Withdraw via Comet App
              </button>

              <div className="rounded-sm bg-[#07110b]/85 border border-white/5 p-4 text-sm text-[#b7c4ba] space-y-3">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Funds are sent{" "}
                    <span className="font-semibold text-primary">instantly</span>{" "}
                    to your Comet App account.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Make sure you use your registered{" "}
                    <span className="font-semibold text-primary">Comet App email</span>.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ── Crypto Tab ─────────────────────────────────────────────────── */}
          {SHOW_CRYPTO_UI && activeTab === "Crypto" && (
            <>
              <div className="flex items-center gap-3 bg-[#07110b]/85 border border-white/10 rounded-lg px-4 py-3">
                <SiTether className="text-2xl text-green-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">Withdraw to an external Celo wallet</p>
                  <p className="text-xs text-[#75877a]">
                    Minimum withdrawal: {MIN_CRYPTO_WITHDRAWAL} {cryptoAsset}
                  </p>
                </div>
              </div>

              {/* Asset selector */}
              <div className="flex rounded-lg overflow-hidden border border-primary/30">
                {CELO_WITHDRAW_ASSETS.map((asset, idx) => (
                  <button
                    type="button"
                    key={asset}
                    onClick={() => setCryptoAsset(asset)}
                    className={`flex-1 py-2 text-sm font-medium transition-all
                      ${cryptoAsset === asset ? "bg-primary text-black" : "bg-background/40 text-[#b7c4ba]"}
                      ${idx !== CELO_WITHDRAW_ASSETS.length - 1 ? "border-r border-primary/30" : ""}`}
                  >
                    {asset}
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[#9cae9f]">Withdrawable balance</span>
                  <span className="font-semibold text-primary">
                    KES {balance?.balance?.toLocaleString() ?? 0}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#9cae9f]">
                  Enter the amount in {cryptoAsset}. It's converted to KES at
                  the live rate and debited from your main wallet when you submit.
                </p>
              </div>

              <input
                value={cryptoAddress}
                onChange={(e) => setCryptoAddress(e.target.value)}
                className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-[#07110b] text-white focus:outline-none focus:border-primary font-mono text-sm"
                placeholder="Celo wallet address (0x...)"
              />

              <input
                type="number"
                value={cryptoAmount}
                onChange={(e) => setCryptoAmount(e.target.value)}
                min={MIN_CRYPTO_WITHDRAWAL}
                className="w-full rounded-lg px-5 py-3 border border-primary/40 placeholder:text-[#6f7f73] bg-[#07110b] text-white focus:outline-none focus:border-primary"
                placeholder={`Amount (${cryptoAsset})`}
              />

              <button
                onClick={handleCryptoWithdraw}
                disabled={!canSubmitCryptoWithdrawal}
                className="w-full bg-primary text-black py-4 rounded-lg text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCryptoWithdrawing ? "Processing..." : `Withdraw ${cryptoAsset}`}
              </button>

              <div className="rounded-sm bg-[#07110b]/85 border border-white/5 p-4 text-sm text-[#b7c4ba] space-y-3">
                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Only send to a valid{" "}
                    <span className="font-semibold text-primary">Celo network</span> address.
                    Sending to the wrong network will result in permanent loss of funds.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Minimum withdrawal is{" "}
                    <span className="font-semibold text-primary">
                      {MIN_CRYPTO_WITHDRAWAL} {cryptoAsset}
                    </span>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <BsInfoCircle className="mt-0.5 text-primary text-lg shrink-0" />
                  <p>
                    Withdrawals are broadcast immediately once submitted and
                    cannot be reversed.
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
