// import { useEffect } from "react";
import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLogIn } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useBanner } from "../../context/BannerContext";
import { normalizeKenyanPhone } from "../../utils/phone";
import { isUserPhoneVerified } from "../../utils/verification";
import {
  clearStoredUser,
  setPendingVerificationPhone,
  setStoredUser,
} from "../../utils/authStorage";

function isVerificationRequiredError(errorResponse, message = "") {
  if (!errorResponse || typeof errorResponse !== "object") {
    return /verify.*phone|phone.*verify|not verified|unverified/i.test(message);
  }

  if (
    errorResponse.verificationRequired === true ||
    errorResponse.requireVerification === true
  ) {
    return true;
  }

  return /verify.*phone|phone.*verify|not verified|unverified/i.test(
    [
      errorResponse.message,
      errorResponse.error,
      errorResponse.status_description,
      message,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  // Close handler: prefer onClose prop (when used as a child modal),
  // otherwise fall back to navigating back so /login nested route closes.
  const handleCloseBase = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    // If history length is > 1, go back; otherwise navigate to root
    try {
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    } catch {
      navigate("/");
    }
  }, [navigate, onClose]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      handleCloseBase();
    }, 300);
  }, [handleCloseBase]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);
  const { logInFn, isLoading } = useLogIn();
  const { showBanner } = useBanner();

  function submitData(e) {
    e.preventDefault();

    const normalizedPhone = normalizeKenyanPhone(phone);

    if (!/^254[71]\d{8}$/.test(normalizedPhone)) {
      toast.error("Enter a valid Kenyan phone number");
      return;
    }

    logInFn(
      { phone: normalizedPhone, password },
      {
        onSuccess: (data) => {
          console.log("LOGIN SUCCESS RESPONSE:", data); // View the whole response
          console.log("LOGIN TOKEN:", data?.token || data?.data?.token || data?.access_token);
          if (!data?.user) return;
          if (!isUserPhoneVerified(data?.user)) {
            clearStoredUser();
            setPendingVerificationPhone(data?.user?.phone || normalizedPhone);
            toast.success(data?.message || "Please verify your phone number");
            navigate(`/verify?phone=${encodeURIComponent(data?.user?.phone || normalizedPhone)}`, {
              state: {
                phone: data?.user?.phone || normalizedPhone,
              },
            });
            return;
          }

          const userData = { token: data.token, ...data.user };
          setStoredUser(userData);
          toast.success(data?.message || "Log in successful");
          if (data?.banner?.showBanner) showBanner(data.banner.currentBanner);
          if (onClose) onClose();
          else navigate("/");
        },
        onError: (err) => {
          const errorResponse = err?.response;
          const verificationPhone =
            errorResponse?.user?.phone ||
            errorResponse?.data?.user?.phone ||
            errorResponse?.phone ||
            errorResponse?.data?.phone ||
            normalizedPhone;

          if (isVerificationRequiredError(errorResponse, err?.message || "")) {
            clearStoredUser();
            setPendingVerificationPhone(verificationPhone);
            toast.success(errorResponse?.message || err?.message || "Please verify your phone number");
            navigate(`/verify?phone=${encodeURIComponent(verificationPhone)}`, {
              state: {
                phone: verificationPhone,
              },
            });
            return;
          }

          toast.error(err?.message || "Something went wrong");
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
        // close when clicking the overlay (but not when clicking inside the modal)
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Outer Container with thin border */}
      <div
        className={`relative w-full max-w-4xl bg-background rounded-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[90vh] ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        {/* TOP BAR: Sign up prompt & Close */}
        <div className="absolute top-0 right-0 left-0 p-4 flex justify-between items-center z-10">
          <p className="text-zinc-400 text-xs ml-auto mr-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary font-bold cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </p>
          <button onClick={handleClose} className="bg-zinc-800 p-1.5 rounded-md text-zinc-400 hover:text-white" aria-label="Close login dialog">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* LEFT SIDE: Decorative Graphics */}
        <div className="hidden md:flex flex-1 items-center justify-center p-0 bg-gradient-to-br from-[#07110b] to-[#02120b]">
          <div className="relative w-full h-full">
            <img
              src="/a1.png"
              alt="Signup promo"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.style.display = 'none'; }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 p-6" />
          </div>
        </div>

        {/* RIGHT SIDE: Login Form (matches design) */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-background overflow-y-auto">
          <div className="mb-8">
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
            <h1 className="text-white text-4xl font-black mb-2">Welcome back</h1>
          </div>

          <form className="space-y-6" onSubmit={submitData}>
            {/* Phone Number Field */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Phone Number</label>
              <input
                type="tel"
                placeholder="0700 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-zinc-300 text-sm">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-zinc-800 rounded-xl px-4 py-4 text-white text-base placeholder:text-zinc-500 outline-none focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setPasswordVisible((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>

                <div className="flex justify-end mt-2">
                  <button type="button" onClick={() => navigate('/forgot-password')} className="text-primary text-sm hover:underline">Forgot Password?</button>
                </div>
              </div>
            </div>

            {/* Sign In Button */}
            <button disabled={isLoading} type="submit" className="w-full bg-primary hover:brightness-105 text-black font-black py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.18)] disabled:opacity-60">
              {isLoading ? 'Signing in…' : (<><span>Sign In</span> <span>→</span></>)}
            </button>

            {/* Play responsibly divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-700" />
              <div className="text-zinc-600 text-sm">Play responsibly</div>
              <div className="flex-1 h-px bg-zinc-700" />
            </div>

            {/* Legal small text */}
            <div className="text-center text-[12px] text-zinc-500">
              You must be 18 years or older to use this platform. Gambling can be addictive. Please play responsibly.
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;
