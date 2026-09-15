import { IoClose } from "react-icons/io5";

import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { useDeposit } from "../../hooks/usePayment";
import BaseClass from "../../services/BaseClass";

export default function DepositModal({ onClose }) {
  const baseClass = new BaseClass();
  const { makingPayment, isLoading } = useDeposit();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { amount: 50 },
    mode: "onTouched",
  });

  const amount = watch("amount");
  const disabled = isLoading || isSubmitting;

  const presetAmounts = [50, 100, 250, 500, 1000, 1500];
  const handlePresetClick = (val) =>
    setValue("amount", val, { shouldValidate: true });

  const onSubmit = ({ amount }) => {
    const phone = baseClass?.phone;
    const userID = baseClass?.userId;

    makingPayment(
      { amount: Number(amount), phone, userID },
      {
        onSuccess: () => {
          reset({ amount: 50 });
          onClose();
        },
        onError: (err) => {
          toast.error(err?.message || "Try again");
        },
      }
    );
  };

  return (
    <div className="fixed bottom-15 inset-0 z-50000 flex flex-col justify-end md:justify-center items-center">
      {/* backdrop (click to close) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={disabled ? undefined : onClose}
      />

      <div className="relative w-full md:w-[90%] md:max-w-md bg-secondary rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl text-[#b7c4ba]">
        {/* Header */}
        <div className="bg-primary flex items-center justify-between px-4 py-2">
          <h2 className="font-semibold text-[17px] flex items-center gap-2 text-black">
            <span className="text-2xl">+</span> Deposit Funds
          </h2>
          <button onClick={onClose} disabled={disabled}>
            <IoClose className="text-black text-2xl" />
          </button>
        </div>

        {/* Content */}
        <form className="p-5" onSubmit={handleSubmit(onSubmit)}>
          {/* M-Pesa Logo */}
          <div className="flex justify-center mb-5">
            <img src="/mpesa.png" alt="M-PESA" className="h-12" />
          </div>

          {/* Account Info */}
          <div className="bg-secondary border border-[#444] text-sm px-4 py-3 rounded-lg mb-1 font-medium tracking-wide text-[#b7c4ba]">
            KE {baseClass?.phone}
          </div>
          <p className="text-sm text-[#b7c4ba] my-4 font-normal">
            This is your primary account number
          </p>

          {/* Preset Amounts */}
          <div className="flex rounded-lg overflow-hidden border border-[#444] mb-4">
            {presetAmounts.map((val, idx) => (
              <button
                type="button"
                key={val}
                onClick={() => handlePresetClick(val)}
                disabled={disabled}
                className={`flex-1 py-2 text-sm font-medium transition-all
                  ${
                    Number(amount) === val
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
            type="number"
            inputMode="numeric"
            min={10}
            max={140000}
            className="w-full px-4 py-2 rounded-md bg-secondary text-[#b7c4ba] border border-[#444] outline-none mb-1 text-sm"
            {...register("amount", {
              required: "Amount is required",
              valueAsNumber: true,
              min: { value: 10, message: "Minimum deposit is KES 10" },
              max: { value: 140000, message: "Maximum deposit is KES 140,000" },
            })}
            disabled={disabled}
          />
          {errors.amount && (
            <p className="text-xs text-red-400 mb-2">{errors.amount.message}</p>
          )}

          {/* Note */}
          <p className="text-xs text-gray-400 mb-4 font-normal">
            Maximum deposit amount is KES 140,000.00
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={disabled}
            className={`w-full font-bold py-3 rounded-lg text-[15px] transition mb-6
              ${
                disabled
                  ? "bg-primary/70 cursor-not-allowed"
                  : "bg-primary hover:brightness-105"
              } text-black`}
          >
            {disabled ? "Processing…" : "Deposit"}
          </button>
        </form>
      </div>
    </div>
  );
}
