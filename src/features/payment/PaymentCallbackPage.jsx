import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentService } from "../../services/PaymentService";
import { useBanner } from "../../context/BannerContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function PaymentView() {
  const [status, setStatus] = useState("Pending");
  const [transactionCode, setTransactionCode] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const { showBanner } = useBanner();
  const [bannerType, setBannerType] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const paymentService = new PaymentService();

  useEffect(() => {
    if (!id) return;
    let stopped = false;
    let interval;
    let timeout;

    const checkTransactionStatus = async () => {
      try {
        const response = await paymentService.getTransactionStatus(id);
        if (stopped) return;
        const rawStatus = response?.data?.status ?? response?.status ?? "pending";
        const newStatus = ["complete", "completed"].includes(
          String(rawStatus).toLowerCase()
        )
          ? "success"
          : String(rawStatus).toLowerCase();

        setStatus(newStatus);

        if (newStatus === "success") {
          const txCode = response?.data?.data?.transactionCode ?? response?.data?.transactionCode ?? response?.transactionCode;
          setTransactionCode(txCode);
        }

        if (newStatus === "success") {
          queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        }

        if (newStatus === "success" && response?.data?.banner?.showBanner) {
          setBannerType(response?.data?.banner?.currentBanner);
        }

        if (newStatus === "success" || newStatus === "failed") {
          if (interval) clearInterval(interval);
          if (timeout) clearTimeout(timeout);
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
      }
    };

    checkTransactionStatus();

    interval = setInterval(() => {
      checkTransactionStatus();
    }, 5000);

    timeout = setTimeout(() => {
      stopped = true;
      clearInterval(interval);
      setTimedOut(true);
    }, 90000);

    return () => {
      stopped = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [id]);

  const handleGoBack = () => {
    if (bannerType) {
      showBanner(bannerType);
    }
    navigate(-1);
  };

  const statusLower = status.toLowerCase();
  const isPending = statusLower === "pending";
  const showWaiting = isPending && timedOut;
  const isSuccess = statusLower === "success";
  const isFailed = statusLower === "failed";

  return (
    <div className="h-full bg-background flex flex-col items-center justify-center px-4 py-8">
      {/* Content */}
      <div className="w-full max-w-sm mx-auto">
          {/* Status Card */}
          <div className="bg-secondary rounded-2xl overflow-hidden">
            {/* Status Icon Section */}
            <div className="pt-10 pb-8 px-6 flex flex-col items-center">
              {/* Icon Container */}
              <div
                className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  isSuccess
                    ? "bg-green-500/15"
                    : isFailed
                    ? "bg-red-500/15"
                    : "bg-primary/10"
                }`}
              >
                {/* Icons */}
                {isPending && (
                  <svg
                    className="w-10 h-10 text-primary animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-90"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}

                {isSuccess && (
                  <svg
                    className="w-10 h-10 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        strokeDasharray: 63,
                        strokeDashoffset: 63,
                        animation: "draw-circle 0.5s ease-out forwards",
                      }}
                    />
                    <path
                      d="M8 12l3 3 5-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 20,
                        strokeDashoffset: 20,
                        animation: "draw-check 0.4s ease-out 0.4s forwards",
                      }}
                    />
                  </svg>
                )}

                {isFailed && (
                  <svg
                    className="w-10 h-10 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        strokeDasharray: 63,
                        strokeDashoffset: 63,
                        animation: "draw-circle 0.5s ease-out forwards",
                      }}
                    />
                    <path
                      d="M15 9L9 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 10,
                        strokeDashoffset: 10,
                        animation: "draw-x 0.3s ease-out 0.4s forwards",
                      }}
                    />
                    <path
                      d="M9 9L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 10,
                        strokeDashoffset: 10,
                        animation: "draw-x 0.3s ease-out 0.5s forwards",
                      }}
                    />
                  </svg>
                )}
              </div>

              {/* Status Text */}
              <h2
                className={`text-xl font-bold mb-2 ${
                  isSuccess
                    ? "text-green-500"
                    : isFailed
                    ? "text-red-500"
                    : "text-primary"
                }`}
              >
                {isPending && (showWaiting ? "Still Waiting" : "Processing...")}
                {isSuccess && "Deposit Successful!"}
                {isFailed && "Deposit Failed"}
              </h2>

              <p className="text-[#9cae9f] text-center text-sm leading-relaxed max-w-[280px]">
                {isPending &&
                  (showWaiting
                    ? "We have not received confirmation yet. If no STK prompt appeared, try again."
                    : "Please wait while we confirm your payment. This may take a few moments.")}
                {isSuccess &&
                  "Your funds have been added to your account successfully."}
                {isFailed &&
                  "We couldn't process your deposit. Please try again or contact support."}
              </p>

              {/* Transaction Code */}
              {isSuccess && transactionCode && (
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      navigator.clipboard.writeText(transactionCode).then(() => {
                        toast.success("Copied!");
                      });
                    } else {
                      const textArea = document.createElement("textarea");
                      textArea.value = transactionCode;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      toast.success("Copied!");
                    }
                  }}
                  className="mt-4 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <code className="text-sm text-[#d7e1d9] bg-white/5 border border-white/10 rounded px-3 py-1.5 group-hover:bg-white/10 transition-colors">
                    {transactionCode}
                  </code>
                  <svg
                    className="w-4 h-4 text-[#75877a] group-hover:text-[#d7e1d9] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Info Section */}
            <div className="px-6 pb-6">
              {/* Tips for pending */}
              {isPending && (
                <div className="bg-background/30 rounded-lg p-3 mb-4">
                  <p className="text-[#75877a] text-xs leading-relaxed text-center">
                    {showWaiting
                      ? "Your transaction is still pending. You can safely go back and start a new deposit if no prompt reached your phone."
                      : "Please don't close this page. Your payment is being verified with M-Pesa."}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {showWaiting && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="w-full py-3.5 rounded-lg bg-white/10 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
                  >
                    Check Again
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/deposit")}
                    className="w-full py-3.5 rounded-lg bg-primary text-black font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isPending && (
                <button
                  type="button"
                  onClick={handleGoBack}
                  className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${
                    isSuccess
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-primary hover:bg-primary/90 text-black"
                  }`}
                >
                  {isSuccess ? "Continue" : "Try Again"}
                </button>
              )}
            </div>
          </div>

        {/* Help Text */}
        {!isPending && (
          <p className="text-center text-[#5f6f64] text-xs mt-4">
            Need help?{" "}
            <span className="text-primary/80 cursor-pointer">
              Contact Support
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentView;
