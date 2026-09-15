import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

import { IoWalletOutline } from "react-icons/io5";
import BaseClass from "../../services/BaseClass";
import toast from "react-hot-toast";

import {
  useUpdateBalance,
  useWithdraw,
} from "../../hooks/usePayment";
import { debouncedWithdraw } from "../../utils/debounce";
import { normalizeKenyanPhone } from "../../utils/phone";

export default function WithdrawalModal({ onClose }) {
  const [withdrawAmount, setWithdrawAmount] = useState(100);
  const [selectedWallet, setSelectedWallet] = useState("balance");
  const [airtimePhone, setAirtimePhone] = useState("");
  const presetAmounts = [100, 250, 500, 1000, 1500];
  const { balance } = useUpdateBalance();
  const { withdrawingCash, isLoading: isWithdrawing } = useWithdraw();
  const baseClass = new BaseClass();
  const activeWithdrawWallet =
    selectedWallet || balance?.activeWallet || baseClass.activeWallet || "balance";
  const withdrawableBalance =
    activeWithdrawWallet === "airtime"
      ? Number(balance?.airtimeBalance ?? baseClass.airtimeBalance ?? 0)
      : Number(balance?.balance ?? baseClass.user?.balance ?? 0);
  const normalizedAirtimePhone = normalizeKenyanPhone(airtimePhone);
  const submitPhone =
    activeWithdrawWallet === "airtime"
      ? normalizedAirtimePhone
      : baseClass?.phone;

  const handlePresetClick = (val) => setWithdrawAmount(val);
  function handleWithdraw() {
    debouncedWithdraw(withdrawAmount, () => {
      if (isWithdrawing) return;

      if (withdrawableBalance === 0)
        return toast.error(
          "You don't have enough amount to make this transaction"
        );

      if (+withdrawAmount > withdrawableBalance) {
        return toast.error(
          "You don't have enough amount to make this transaction"
        );
      }

      if (+withdrawAmount < 100) {
        return toast.error("Withdrawals start at Ksh 100 and above.");
      }

      if (activeWithdrawWallet === "airtime" && !airtimePhone.trim()) {
        return toast.error("Please enter the telecom number for airtime withdrawal.");
      }

      withdrawingCash(
        {
          withdrawAmount,
          walletType: activeWithdrawWallet,
          phone: submitPhone,
        },
        {
          onSuccess: () => {
            setWithdrawAmount("");
            if (activeWithdrawWallet === "airtime") {
              setAirtimePhone("");
            }
          },
          onError: (err) => {
            toast.error(
              err?.message || `Withdrawal of Ksh ${withdrawAmount} failed`
            );
          },
        }
      );
    });
  }

  return (
    <div className="fixed inset-0 bottom-15 flex flex-col justify-end md:justify-center items-center z-50">
      <div className="w-full md:w-[90%] md:max-w-md bg-secondary rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl text-[#b7c4ba]">
        {/* Header */}
        <div className="bg-primary flex items-center justify-between px-4 py-2">
          <h2 className="font-semibold text-[17px] flex items-center gap-2 text-black">
            <IoWalletOutline /> Withdraw
          </h2>
          <button onClick={onClose}>
            <IoClose className="text-black text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* M-Pesa Logo */}
          <div className="flex justify-center mb-5">
            <img src="/mpesa.png" alt="M-PESA" className="h-12" />
          </div>

          {/* Account Info */}
          {activeWithdrawWallet === "airtime" ? (
            <>
              <input
                type="tel"
                value={airtimePhone}
                onChange={(e) => setAirtimePhone(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-secondary text-[#b7c4ba] border border-[#444] outline-none mb-1 text-sm"
                placeholder="Enter telecom number for airtime"
              />
              <p className="text-sm text-[#b7c4ba] my-4 font-normal">
                Airtime will be sent to the telecom number you enter.
              </p>
            </>
          ) : (
            <>
              <div className="bg-secondary border border-[#444] text-sm px-4 py-3 rounded-lg mb-1 font-medium tracking-wide text-[#b7c4ba]">
                KE {baseClass?.phone}
              </div>
              <p className="text-sm text-[#b7c4ba] my-4 font-normal">
                This is your primary M-Pesa account number
              </p>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              onClick={() => setSelectedWallet("balance")}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                activeWithdrawWallet === "balance"
                  ? "border-primary bg-primary text-black"
                  : "border-[#444] bg-secondary text-[#b7c4ba]"
              }`}
            >
              Main Wallet
              <span className="mt-1 block text-xs font-normal opacity-80">
                KES {Number(balance?.balance ?? baseClass.user?.balance ?? 0).toLocaleString()}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedWallet("airtime")}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                activeWithdrawWallet === "airtime"
                  ? "border-primary bg-primary text-black"
                  : "border-[#444] bg-secondary text-[#b7c4ba]"
              }`}
            >
              Airtime Wallet
              <span className="mt-1 block text-xs font-normal opacity-80">
                KES {Number(balance?.airtimeBalance ?? baseClass.airtimeBalance ?? 0).toLocaleString()}
              </span>
            </button>
          </div>

          {/* Preset Amounts */}
          <div className="flex rounded-lg overflow-hidden border border-[#444] mb-4">
            {presetAmounts.map((val, idx) => (
              <button
                key={val}
                onClick={() => handlePresetClick(val)}
                className={`flex-1 py-2 text-sm font-medium transition-all 
                  ${
                    withdrawAmount === val
                      ? "bg-primary text-black"
                      : "bg-secondary text-[#b7c4ba]"
                  } 
                  ${
                    idx !== presetAmounts.length - 1
                      ? "border-r border-[#444]"
                      : ""
                  } 
                  ${idx === 0 ? "rounded-l-md" : ""} 
                  ${idx === presetAmounts.length - 1 ? "rounded-r-md" : ""}`}
              >
                +{val}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <input
            type="text"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-secondary text-[#b7c4ba] border border-[#444] outline-none mb-2 text-sm"
          />

          {/* Max Note */}
          <p className="text-xs text-[#b7c4ba] mb-4 font-normal">
            Minimum withdrawal amount is KES 100.00
          </p>

          {/* Deposit Button */}
          <button
            onClick={() => handleWithdraw()}
            disabled={isWithdrawing}
            className="w-full bg-primary text-black font-bold py-3 rounded-lg text-[15px] hover:brightness-105 transition mb-6"
          >
            {isWithdrawing ? "Processing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
}
