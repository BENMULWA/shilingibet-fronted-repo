
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiPhone, FiLock, FiGift } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useRegister } from "../../hooks/useAuth";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BounceLoading } from "respinner";
import { useBanner } from "../../context/BannerContext";
import Turnstile from "../../components/auth/Turnstile";
import { normalizeKenyanPhone } from "../../utils/phone";
import { isUserPhoneVerified } from "../../utils/verification";
import {
  clearPendingVerificationPhone,
  clearStoredUser,
  setPendingVerificationPhone,
  setStoredUser,
} from "../../utils/authStorage";

export default function Register() {
  const [showReferral, setShowReferral] = useState(true);
  const [referral, setReferral] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  }
  // const [turnstileToken, setTurnstileToken] = useState(null);
  // const turnstileRef = useRef(null);
  const { showBanner } = useBanner();
  const { registerFn, isLoading } = useRegister();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setReferral(params.get("ref") || "");
  }, [location]);

  function submitData(data) {
    // if (!turnstileToken) {
    //   toast.error("Please wait for security verification to complete");
    //   return;
    // }

    const phone = normalizeKenyanPhone(data.phone);

    registerFn(
      { ...data, phone, referralCode: referral || "" },
      {
        onSuccess: (response) => {
          // turnstileRef.current?.reset();
          // setTurnstileToken(null);
          if (response?.status) {
            if (response?.banner?.showBanner) {
              showBanner(response?.banner?.currentBanner || "registration");
            }

            if (isUserPhoneVerified(response?.user)) {
              const userData = { token: response?.token, ...response?.user };
              setStoredUser(userData);
              clearPendingVerificationPhone();
              toast.success(response?.message || "Account created successfully");
              navigate("/");
            } else {
              const verificationPhone = response?.user?.phone || phone;
              clearStoredUser();
              setPendingVerificationPhone(verificationPhone);
              toast.success(response?.message || "Account created. Enter the SMS code to verify your number.");
              navigate(`/verify?phone=${encodeURIComponent(verificationPhone)}`, {
                state: { phone: verificationPhone },
              });
            }
          } else {
            toast.error(response?.message || "Registration failed");
          }
        },
        onError: (error) => {
          // turnstileRef.current?.reset();
          // setTurnstileToken(null);
          toast.error(error?.message || "Something went wrong");
        },
      }
    );
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
            Already have an account?{" "}
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
          <div className="relative w-full h-full min-h-[560px]">
            <img
              src="/a1.png"
              alt="Register promo"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="flex-1 p-8 md:px-16 md:py-14 flex flex-col justify-center bg-background overflow-y-auto max-h-screen">
          <div className="mb-6">
            {window.innerWidth < 768 ? (
              <img
                src="/favicon.ico"
                alt="ShilingiBet"
                className="h-12 w-12 object-contain"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <img
                src="/shilingibet.png"
                alt="ShilingiBet"
                className="h-12"
                loading="lazy"
                decoding="async"
              />
            )}
            <h1 className="text-white text-4xl font-black mb-2">Create account</h1>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(submitData)}>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Phone Number</label>
              <input
                type="tel"
                inputMode="tel"
                maxLength="13"
                placeholder="0700 000 000"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^(\+254|0)?[71]\d{8}$/,
                    message: "Enter a valid Kenyan phone number (07X or 01X)",
                  },
                })}
                className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
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
              {errors.password
                ? <p className="text-red-400 text-xs">{errors.password.message}</p>
                : <p className="text-xs text-zinc-600">Password must be at least 6 characters</p>
              }
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowReferral(!showReferral)}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-accent transition-colors"
              >
                <FiGift className="text-accent" />
                Referral Code (Optional)
                {showReferral ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              {showReferral && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FiGift className="text-zinc-600" size={16} />
                  </div>
                  <input
                    type="text"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    placeholder="Enter referral code"
                    className="w-full bg-surface border border-zinc-800 rounded-xl pl-11 pr-10 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
                  />
                  {referral && (
                    <IoMdClose
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 cursor-pointer hover:text-red-400 transition-colors"
                      onClick={() => setReferral("")}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1 accent-primary w-4 h-4 rounded"
              />
              <label className="leading-snug text-zinc-500">
                I am 18+ and have read and accept the{" "}
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Turnstile (uncomment when ready) */}
            {/* <Turnstile
              ref={turnstileRef}
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
              onError={() => {
                setTurnstileToken(null);
                toast.error("Security verification failed. Please refresh.");
              }}
            /> */}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isChecked || isLoading}
              className="w-full bg-primary hover:brightness-105 text-black font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <BounceLoading fill="#000" barHeight={12} />
                : <><span>Create Account</span><span>→</span></>
              }
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700" />
              <span className="text-zinc-600 text-sm">Play responsibly</span>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            <p className="text-center text-[12px] text-zinc-500">
              You must be 18 years or older to use this platform. Gambling can be addictive. Please play responsibly.
            </p>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
