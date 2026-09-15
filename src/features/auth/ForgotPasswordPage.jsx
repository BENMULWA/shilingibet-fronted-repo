import { useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "../../hooks/useAuth";
import { BounceLoading } from "respinner";
import { normalizeKenyanPhone } from "../../utils/phone";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  }
  const { forgotPasswordAPI, isPending: isLoading } = useForgotPassword();
  const { handleSubmit, register } = useForm();

  function submitData(data) {
    const phone = normalizeKenyanPhone(data.phone);

    forgotPasswordAPI({ ...data, phone }, {
      onSuccess: (dt) => {
        navigate(`/reset?phone=${encodeURIComponent(phone)}`);
        toast.success(dt?.message);
      },
      onError: (dt) => {
        toast.error(dt?.message || "Something went wrong, kindly try again");
      },
    });
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? "bg-black/0 backdrop-blur-0" : "bg-black/75 backdrop-blur-sm"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-4xl bg-background rounded-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[90vh] ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >

        {/* TOP BAR */}
        <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-center z-10">
          <p className="text-zinc-400 text-xs ml-auto mr-4">
            Remember your password?{" "}
            <Link to="/login" className="text-primary font-bold cursor-pointer hover:underline">
              Sign in
            </Link>
          </p>
          <button
            onClick={handleClose}
            className="bg-zinc-800 p-1.5 rounded-md text-zinc-400 hover:text-white transition-colors"
          >
            <IoMdClose size={16} />
          </button>
        </div>

        {/* LEFT: Image */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-black">
          <div className="relative w-full h-full min-h-[460px]">
            <img
              src="/a1.png"
              alt="Forgot password promo"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-background overflow-y-auto">
          <div className="mb-8">
            <img
              src="/favicon.ico"
              alt="ShilingiBet"
              className="mb-4 h-12 w-12 object-contain md:hidden"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/shilingibet.png"
              alt="ShilingiBet"
              className="hidden h-12 md:block"
              loading="lazy"
              decoding="async"
            />
            <h1 className="text-white text-4xl font-black mb-2">Recover Account</h1>
            <p className="text-zinc-500 text-sm">
              Enter your phone number and we'll send you a recovery code
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(submitData)}>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Phone Number</label>
              <input
                type="tel"
                placeholder="0700 000 000"
                {...register("phone", { required: true })}
                className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:brightness-105 text-black font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <BounceLoading fill="#000" barHeight={12} />
                : <><span>Send Recovery Code</span><span>→</span></>
              }
            </button>
          </form>

          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="mt-6 flex items-center gap-2 text-sm text-primary hover:underline font-medium transition-colors"
          >
            <IoArrowBack size={16} />
            <span>Back to Login</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-600 text-sm">Need help?</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <p className="text-center text-[12px] text-zinc-500 mt-4">
            If you're having trouble recovering your account, please contact our support team.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
