import { useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useResetPassword } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { BounceLoading } from "respinner";
import { normalizeKenyanPhone } from "../../utils/phone";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPasswordAPI, isPending } = useResetPassword();
  const [searchParams] = useSearchParams();
  const phone = normalizeKenyanPhone(searchParams.get("phone") || "");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleSubmit, register } = useForm();

  function submitData(formData) {
    const otp = formData.code;
    const newPassword = formData.password;

    if (!otp || !newPassword || !phone) {
      toast.error("All fields are required");
      return;
    }

    resetPasswordAPI(
      { otp, newPassword, phone },
      {
        onSuccess: (dt) => {
          if (dt?.success === true || dt?.status === true) {
            toast.success(dt?.message || "Password reset successfully");
            navigate("/login");
          } else {
            toast.error(dt?.message || "Failed to reset password");
          }
        },
        onError: (err) => {
          toast.error(err?.message || "Something went wrong");
        },
      }
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-background rounded-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row shadow-2xl">

        {/* TOP BAR */}
        <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-center z-10">
          <p className="text-zinc-400 text-xs ml-auto mr-4">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline font-bold cursor-pointer">
              Sign in
            </Link>
          </p>
          <button
            onClick={() => navigate(-1)}
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
              alt="Reset password promo"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-background">
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
            <h1 className="text-white text-4xl font-black mb-2">Reset Password</h1>
            <p className="text-zinc-500 text-sm">
              Enter the recovery code we sent to your phone
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(submitData)}>

            {/* Recovery Code */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Recovery Code</label>
              <input
                type="tel"
                placeholder="Enter 6-digit code"
                {...register("code", { required: true })}
                  className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("password", { required: true })}
                    className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {passwordVisible
                    ? <AiOutlineEyeInvisible size={20} />
                    : <AiOutlineEye size={20} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary hover:brightness-105 text-black font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending
                ? <BounceLoading fill="#000" barHeight={12} />
                : <><span>Set New Password</span><span>→</span></>
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
            <span className="text-zinc-600 text-sm">Almost done!</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <p className="text-center text-[12px] text-zinc-500 mt-4">
            Didn't receive the code? Check your SMS or try requesting a new one.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
