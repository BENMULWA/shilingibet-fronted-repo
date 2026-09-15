import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PaymentService } from "../services/PaymentService";
import { mergeStoredUser } from "../utils/authStorage";

export function useDeposit() {
  const paymentService = new PaymentService();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: makingPayment,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.depositCash.bind(paymentService),
    onSuccess: (res) => {
      toast.success(
        "Check your phone. When prompted, enter your M-Pesa pin on your phone to complete payment"
      ); // ✅ invalidate balance after deposit
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      const transactionId =
        res?.data?.txnID ||
        res?.data?.transactionsID ||
        res?.data?.transactionID ||
        res?.data?.transactionId ||
        res?.data?._id ||
        res?.txnID ||
        res?.transactionsID;

      if (transactionId) {
        navigate(`/callback/${transactionId}`);
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? "Something went wrong");
    },
  });

  return { makingPayment, isLoading, error };
}

export function useWithdraw() {
  const paymentService = new PaymentService();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    mutate: withdrawingCash,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.withdrawCash.bind(paymentService),
    onSuccess: (res) => {
      if (res?.success === false || res?.status === false) {
        toast.error(
          res?.data?.message ?? "Something went wrong try again later"
        );
      } else {
        // ✅ invalidate balance after withdrawal
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        const transactionId =
          res?.data?.transactionsID ||
          res?.data?.txnID ||
          res?.data?.transactionID ||
          res?.data?.transactionId ||
          res?.data?._id ||
          res?.transactionsID;

        if (transactionId) {
          navigate(`/withdraw/callback/${transactionId}`);
        }
        toast.success(res?.message || "Withdrawal was successful");
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? "Something went wrong");
    },
  });
  return { withdrawingCash, isLoading, error };
}
export function useUpdateBalance() {
  const paymentService = new PaymentService();
  const isAuth = paymentService.isAuthenticated();

  const { data: balance, isLoading } = useQuery({
    queryKey: ["user-balance"],
    queryFn: paymentService.updateBalance.bind(paymentService),
    enabled: isAuth,
    refetchInterval: 5000, // Refresh every 5 seconds to keep live balance updated while playing games
  });

  useEffect(() => {
    if (isAuth && balance) {
      mergeStoredUser(balance);
    }
  }, [balance, isAuth]);

  return { balance, isLoading };
}

export function useSwitchActiveWallet() {
  const paymentService = new PaymentService();
  const queryClient = useQueryClient();

  const {
    mutate: switchActiveWallet,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (wallet) => paymentService.switchActiveWallet(wallet),
    onSuccess: (res) => {
      const payload = res?.data ?? res;
      mergeStoredUser(payload);
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      toast.success(res?.message || "Active wallet updated");
    },
    onError: (err) => {
      toast.error(err?.message || "Unable to switch wallet");
    },
  });

  return { switchActiveWallet, isLoading, error };
}
export function useTransactionsHistory() {
  const paymentService = new PaymentService();
  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryFn: paymentService.transactionHistory.bind(paymentService),
    queryKey: ["transactions"],
    onError: (err) => {
      toast.error(err?.message ?? "Something went wrong fetching your history");
    },
  });

  return { transactions, isLoading, error };
}
export function useGetTransactionStatus() {
  const paymentService = new PaymentService();
  const {
    mutate: getTransactionStatusAPI,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (uniqueID) =>
      paymentService.getTransactionStatus.bind(paymentService)(uniqueID),
    onSuccess: () => {},
  });

  return { getTransactionStatusAPI, isLoading, error };
}
export function useIssueKey() {
  const paymentService = new PaymentService();
  const {
    mutate: creatingKey,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.createPaymentKey?.bind(paymentService),
  });

  return { creatingKey, isLoading, error };
}
export default function useRedeemBonus() {
  const navigate = useNavigate();
  const paymentService = new PaymentService();
  const queryClient = useQueryClient();
  const {
    mutate: redeemingBonus,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.redeemBonus?.bind(paymentService),
    onSuccess: (res) => {
      if (res.status !== true) {
        toast.error(
          res?.data?.message ?? "Something went wrong try again later"
        );
      } else {
        // ✅ Invalidate balance query after success
        queryClient.invalidateQueries({ queryKey: ["user-balance"] });
        navigate("/profile");
        toast.success(res?.data?.message ?? "Bonus redeemed successfully");
      }
    },
    onError: (err) => {
      toast.error(err?.message ?? "Something went wrong");
    },
  });

  return { redeemingBonus, isLoading, error };
}

export function useWithdrawCrypto() {
  const paymentService = new PaymentService();
  const queryClient = useQueryClient();

  const {
    mutate: withdrawCrypto,
    isPending: isLoading,
    data,
    reset,
  } = useMutation({
    mutationFn: paymentService.withdrawCrypto.bind(paymentService),
    onSuccess: (res) => {
      // A 2xx here already means the gateway broadcast the on-chain
      // transfer and the KES wallet was debited — there's no separate
      // "failed" success payload, failures reject via onError instead.
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      toast.success(res?.provider?.message || "Crypto withdrawal submitted successfully");
    },
    onError: (err) => {
      toast.error(err?.message || "Something went wrong");
    },
  });

  return { withdrawCrypto, isLoading, data, reset };
}

export function useFusionDeposit() {
  const paymentService = new PaymentService();
  const queryClient = useQueryClient();

  const {
    mutate: depositViaFusion,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.depositFusion.bind(paymentService),
    onSuccess: (res) => {
      toast.success(
        res?.message || "Fusion Fi deposit order created successfully"
      );
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Something went wrong");
    },
  });

  return { depositViaFusion, isLoading, error };
}

export function useCardDeposit() {
  const paymentService = new PaymentService();

  const {
    mutate: createCardPaymentLink,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: paymentService.createCardPaymentLink.bind(paymentService),
    onSuccess: (res) => {
      toast.success(
        res?.message || "Card payment link created successfully"
      );
    },
    onError: (err) => {
      toast.error(err?.message || "Something went wrong");
    },
  });

  return { createCardPaymentLink, isLoading, error };
}

// Fetches (and caches) this user's permanent Celo deposit address for a
// given asset. Enabled lazily so we don't hit the gateway until the user
// actually opens the crypto deposit tab.
export function useCeloDeposit(asset = "USDT", enabled = true) {
  const paymentService = new PaymentService();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["celo-deposit-address", asset],
    queryFn: () => paymentService.getCeloDepositAddress(asset),
    enabled,
    staleTime: Infinity, // the address is permanent per user/asset — no need to refetch
    retry: 1,
  });

  return { depositAddress: data, isLoading, isFetching, error, refetch };
}

// Actively asks the Celo gateway for this user's balance and credits any
// new deposit — a fallback for local/dev environments where the gateway's
// deposit.credited webhook has nowhere reachable to land.
export function useCeloDepositSync() {
  const paymentService = new PaymentService();
  const queryClient = useQueryClient();

  const { mutateAsync: syncCeloDeposit, isPending: isLoading } = useMutation({
    mutationFn: (asset = "USDT") => paymentService.syncCeloDeposit(asset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
    },
  });

  return { syncCeloDeposit, isLoading };
}

export function useCryptoUpdateDeposit() {
  const paymentService = new PaymentService();
    const queryClient = useQueryClient();
  
  const {mutate: depositCrypto, isPending: isLoading, error} = useMutation({
    mutationFn: paymentService.updateCryptoWalletBalance?.bind(paymentService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-balance"] });
      // window.location.reload();
    }
  })

  return {depositCrypto, isLoading, error};
}
