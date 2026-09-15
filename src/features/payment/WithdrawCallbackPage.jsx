import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CloseCircle, TickCircle } from "iconsax-react";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentService } from "../../services/PaymentService";
import { useBanner } from "../../context/BannerContext";

function WithdrawView() {
  const [status, setStatus] = useState("Pending");
  // eslint-disable-next-line no-unused-vars
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [bannerType, setBannerType] = useState(null);
  const navigate = useNavigate();
  const paymentService = new PaymentService();
  const { showBanner } = useBanner();
  const { id } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const checkTransactionStatus = async () => {
      try {
        const response =
          await paymentService.getWithdrawalTransactionStatus.bind(
            paymentService
          )(id);
        const rawStatus = response?.data?.status ?? response?.status ?? "pending";
        const newStatus = ["complete", "completed"].includes(
          String(rawStatus).toLowerCase()
        )
          ? "success"
          : String(rawStatus).toLowerCase();

        setStatus(newStatus);
        // ✅ Save banner type but don’t show yet
        if (newStatus === "success" && response?.data?.banner?.showBanner) {
          setBannerType(response?.data?.banner?.currentBanner);
        }

        if (newStatus === "success" || newStatus === "failed") {
          clearInterval(interval);
          queryClient.invalidateQueries({ queryKey: ["user-balance"] });
          queryClient.invalidateQueries({ queryKey: ["user"] });
          window.dispatchEvent(new Event("refreshGame"));
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
      }
    };

    // Check status every 5 seconds
    const interval = setInterval(() => {
      checkTransactionStatus();
      setTimeElapsed((prev) => prev + 5);
    }, 5000);

    // Stop checking after 1 minute
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 60000);

    // Cleanup
    return () => {
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

  return (
    <div className="w- h-screen bg-background flex justify-center items-center align-middle">
      <div className="grid px-4 py-24 bg-transparent sm:px-6 lg:px-8 place-items-center">
        <div className="relative w-full max-w-md mx-auto overflow-hidden bg-secondary rounded-xl">
          <div className="p-8">
            <div className="text-center">
              {status.toLowerCase() == "pending" && (
                <svg
                  className="w-10 h-10 mx-auto text-[#b7c4ba] animate-spin"
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
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}

              {status.toLowerCase() == "success" && (
                <div className="flex justify-center items-center">
                  <TickCircle size={40} color="green" />
                </div>
              )}

              {status.toLowerCase() == "failed" && (
                <div className="flex justify-center items-center">
                  <CloseCircle size={40} color="red" />
                </div>
              )}

              {status.toLowerCase() == "pending" && (
                <p className="mt-8 text-xl font-bold text-[#b7c4ba]">
                  Transaction in Progress
                </p>
              )}

              {status.toLowerCase() == "failed" && (
                <p className="mt-8 text-xl font-bold text-red-500">
                  Transaction Failed
                </p>
              )}

              {status.toLowerCase() == "success" && (
                <p className="mt-8 text-xl font-bold text-green-500">
                  Transaction success
                </p>
              )}

              {status.toLowerCase() == "pending" && (
                <p className="mt-3 text-base font-medium text-[#b7c4ba]">
                  This can take a few minutes. Don’t leave this page.
                </p>
              )}

              {status.toLowerCase() == "success" && (
                <p className="mt-3 text-base font-medium text-[#b7c4ba]">
                  Your transaction is complete. Please go back to view your
                  transactions
                </p>
              )}

              {status.toLowerCase() == "failed" && (
                <p className="mt-3 text-base font-medium text-[#b7c4ba]">
                  Your transaction failed. Please go back to retry your
                  transactions
                </p>
              )}

              {status.toLowerCase() !== "pending" && (
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="cursor-pointer inline-flex items-center justify-center w-full px-6 py-4 text-xs font-bold tracking-widest text-[#b7c4ba] uppercase transition-all duration-200 bg-transparent border border-primary/40 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 "
                  >
                    Go Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawView;
