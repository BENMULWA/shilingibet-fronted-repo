import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BounceLoading } from "respinner";
import { useActivateAccount, useResendOTP } from "../../hooks/useAuth";
import { useBanner } from "../../context/BannerContext";
import { normalizeKenyanPhone } from "../../utils/phone";
import {
  clearPendingVerificationPhone,
  getPendingVerificationPhone,
  getStoredUser,
  setPendingVerificationPhone,
  setStoredUser,
} from "../../utils/authStorage";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneFromQuery = new URLSearchParams(location.search).get("phone") || "";
  const storedUser = getStoredUser();
  const phone = normalizeKenyanPhone(
    location.state?.phone ||
      phoneFromQuery ||
      getPendingVerificationPhone() ||
      storedUser?.phone ||
      ""
  );
  const redirectTo = location.state?.from?.pathname || "/";
  const { showBanner } = useBanner();
  const { handleSubmit, register } = useForm();
  const [resendTimer, setResendTimer] = useState(30);

  const { activateAccountFn, isLoading: isVerifying } = useActivateAccount();
  const { resendOTPFn, isLoading: isResending } = useResendOTP();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (phone) {
      setPendingVerificationPhone(phone);
    }
  }, [phone]);

  function submitOtp(data) {
    if (!phone) {
      toast.error("Phone number missing. Please register again.");
      navigate("/register");
      return;
    }

    activateAccountFn(
      { code: data.otp, phone },
      {
        onSuccess: (res) => {
          if (res?.status) {
            toast.success("OTP Verified Successfully");
            const userData = { token: res?.token, ...res.user };
            setStoredUser(userData);
            clearPendingVerificationPhone();
            navigate(redirectTo, { replace: true });
            if (res?.banner?.showBanner) {
              showBanner(res?.banner?.currentBanner || "registration");
            }
          } else {
            toast.error(res?.message || "Invalid OTP");
          }
        },
        onError: (err) => {
          toast.error(err?.message || "Verification failed");
        },
      }
    );
  }

  function resendOtp() {
    if (!phone) {
      toast.error("Phone number missing. Please register again.");
      navigate("/register");
      return;
    }

    resendOTPFn(
      { phone },
      {
        onSuccess: (res) => {
          if (res?.status) {
            toast.success("OTP resent successfully");
            setPendingVerificationPhone(phone);
            setResendTimer(90);
          } else {
            toast.error(res?.message || "Could not resend OTP");
          }
        },
        onError: (err) => {
          toast.error(err?.message || "Resend failed");
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
            Wrong number?{" "}
            <Link to="/register" className="text-primary hover:underline font-bold cursor-pointer">
              Go back
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
              alt="Verify promo"
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
              src="/shilingibet.png"
              alt="ShilingiBet"
              className="h-12 md:hidden mb-4"
              loading="lazy"
              decoding="async"
            />
            <h1 className="text-white text-4xl font-black mb-2">Verify OTP</h1>
            <p className="text-zinc-500 text-sm">
              Enter the 6-digit code sent to{" "}
              <span className="text-primary font-semibold">{phone}</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(submitOtp)}>

            {/* OTP Input */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Enter OTP</label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                {...register("otp", { required: true })}
                className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-2xl tracking-[0.5em] text-center placeholder:text-zinc-500 placeholder:tracking-normal outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-primary hover:brightness-105 text-black font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isVerifying
                ? <BounceLoading fill="#000" barHeight={12} />
                : <><span>Verify Code</span><span>→</span></>
              }
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 flex justify-center items-center text-sm text-zinc-500">
            <span>
              Didn't get the code?{" "}
              {resendTimer > 0 ? (
                <span className="text-primary font-medium">Resend in {resendTimer}s</span>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={isResending}
                  className="text-primary font-medium hover:underline transition-all disabled:opacity-60"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </button>
              )}
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-600 text-sm">Almost there!</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <p className="text-center text-[12px] text-zinc-500 mt-4">
            Check your SMS inbox for the verification code. It may take a moment to arrive.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
