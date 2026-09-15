import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import BaseClass from "../../services/BaseClass";

export default function DeleteAccountModal({ open, onClose, onConfirm }) {
  const base = new BaseClass();
  const phone = base?.phone;
  const [period, setPeriod] = useState("");

  const handleDelete = () => {
    if (!phone || !period) {
      return alert("Please enter phone number and select period of exclusion.");
    }
    onConfirm({ phone, period });
  };

  if (!open) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 mx-auto p-4">
      {/* Modal Container */}
      <div
        className="relative bg-secondary/95 border border-gray-700 rounded-t-2xl md:rounded-2xl shadow-2xl 
        w-full max-w-lg mx-auto h-auto max-h-[90vh] overflow-y-auto p-6 
        sm:mx-4 sm:my-8 sm:rounded-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-red-500 transition"
        >
          <IoMdClose className="text-[#b7c4ba] text-lg" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-4 md:mt-0">
          <div className="bg-red-500/20 p-3 rounded-full">
            <FaTrashAlt className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-red-500">
            Delete Account
          </h2>
        </div>

        {/* Info Section */}
        <div className="bg-background/50 border border-gray-600 rounded-xl p-4 mb-6">
          <p className="text-sm text-[#b7c4ba] leading-relaxed flex items-start gap-2">
            <FaInfoCircle className="text-yellow-400 mt-1 shrink-0" />
            This option allows you to take a break from gambling by temporarily
            restricting access to your account. During this time, you cannot log
            in, deposit, or place bets.
          </p>
          <p className="text-xs text-red-400 mt-2">
            ⚠ Withdraw your funds before confirming self-exclusion. This action
            cannot be reversed.
          </p>
        </div>

        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-[#b7c4ba]">
            Your Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            placeholder="07XXXXXXXX"
            disabled
            className="w-full bg-background border border-gray-600 rounded-md px-4 py-2 text-[#b7c4ba]  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Period of Exclusion */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-[#b7c4ba]">
            Select Period of Exclusion
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-background border border-gray-600 rounded-md px-4 py-2 text-[#b7c4ba]  focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose exclusion period</option>
            <option value="1_week">1 Week</option>
            <option value="1_month">1 Month</option>
            <option value="3_months">3 Months</option>
            <option value="6_months">6 Months</option>
            <option value="permanent">Permanent Deletion</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 border border-gray-700 bg-secondary text-[#b7c4ba] font-semibold py-2 rounded-lg  transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="w-full cursor-pointer sm:w-1/2 bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}
