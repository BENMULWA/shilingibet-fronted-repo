import { fetchAPI } from "../utils/FetchApi";
import { getApiBaseUrl } from "../utils/apiBase";
import BaseClass from "./BaseClass";

const API_URL = getApiBaseUrl();
const DEFAULT_CARD_REDIRECT_URL =
  import.meta.env.VITE_CARD_PAYMENT_REDIRECT_URL ||
  "https://shilingibet.com/deposit";

export class PaymentService extends BaseClass {
  constructor() {
    super();
  }
  async depositCash({ amount, walletType }) {
    try {
      return await fetchAPI(
        "transactions/deposit",
        "POST",
        {
          amount: +amount,
          ...(this.phone ? { phone: this.phone } : {}),
          ...(walletType ? { walletType } : {}),
        },
        this.token
      );
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }
  async updateBalance() {
    try {
      const response = await fetchAPI("users/me", "GET", null, this.token);
      const payload = response?.data ?? response;
      return payload?.user ?? payload;
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }
  async withdrawCash({ withdrawAmount, walletType, phone, provider }) {
    try {
      return await fetchAPI(
        "transactions/withdraw",
        "POST",
        {
          amount: +withdrawAmount,
          ...((phone || this.phone) ? { phone: phone || this.phone } : {}),
          ...(provider ? { provider } : {}),
          ...(walletType ? { walletType } : {}),
        },
        this.token
      );
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }
  async transactionHistory() {
    try {
      return await fetchAPI("transactions", "GET", null, this.token);
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }
  async getTransactionStatus(uniqueID) {
    try {
      return await fetchAPI(
        `transactions/${uniqueID}`,
        "GET",
        null,
        this.token
      );
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  } // Get withdrawal transaction status
  async getWithdrawalTransactionStatus(uniqueID) {
    const response = await fetchAPI(
      `transactions/${uniqueID}`,
      "GET",
      null,
      this.token
    );

    if (response?.status === 409) {
      throw new Error("Too many withdrawal requests. Please try later.");
    }

    return response;
  }
  async createPaymentKey() {
    try {
      return await fetchAPI("wallet/createIssueKey", "POST", null, this.token);
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  // Celo BaaS gateway withdrawal: debits the user's KES wallet at the live
  // gateway rate and broadcasts an on-chain stablecoin transfer to
  // `toAddress` on the Celo network.
  async withdrawCrypto({ amount, toAddress, asset = "USDT" }) {
    const payload = { amount: +amount, to_address: toAddress, asset };
    try {
      const response = await fetchAPI(
        "wallet/celo/withdraw",
        "POST",
        payload,
        this.token
      );
      return response?.data ?? response;
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  // Celo BaaS gateway deposits: returns this user's permanent Celo deposit
  // address for the given asset. The gateway's background watcher credits
  // KES automatically once the on-chain transfer confirms — no manual TxID
  // submission needed here.
  async getCeloDepositAddress(asset = "USDT") {
    try {
      const response = await fetchAPI(
        `wallet/celo/deposit?asset=${encodeURIComponent(asset)}`,
        "GET",
        null,
        this.token
      );
      return response?.data ?? response;
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  // Pulls this user's current balance from the Celo gateway and credits any
  // delta since the last sync. Backstops the deposit.credited webhook for
  // environments where the gateway can't reach this backend directly.
  async syncCeloDeposit(asset = "USDT") {
    try {
      const response = await fetchAPI(
        `wallet/celo/deposit/sync?asset=${encodeURIComponent(asset)}`,
        "GET",
        null,
        this.token
      );
      return response?.data ?? response;
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  async depositFusion({ amount, email, currency, comment, description, external_ref }) {
    const payload = {
      amount: +amount,
      email,
      ...(currency ? { currency } : {}),
      ...(comment ? { comment } : {}),
      ...(description ? { description } : {}),
      ...(external_ref ? { external_ref } : {}),
    };

    try {
      return await fetchAPI(
        "wallet/billOrder",
        "POST",
        payload,
        this.token
      );
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  async createCardPaymentLink({
    amount,
    email,
    currency,
    country,
    description,
    externalRef,
    redirectUrl,
    phone,
    firstName,
    lastName,
    walletType,
  }) {
    const payload = {
      amount: +amount,
      currency: currency || "USD",
      country: country || "US",
      email,
      phone: phone || this.phone || "",
      first_name: firstName || this.firstName || "Shilingi",
      last_name: lastName || this.lastName || "Player",
      redirect_url: redirectUrl || DEFAULT_CARD_REDIRECT_URL,
      external_ref: externalRef || `deposit-${this.userId || "guest"}-${Date.now()}`,
      description: description || "Wallet top-up",
      ...(walletType ? { walletType } : {}),
    };

    try {
      return await fetchAPI("wallet/card-link", "POST", payload, this.token);
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  async switchActiveWallet(wallet) {
    try {
      return await fetchAPI(
        "users/wallet/active",
        "PATCH",
        { wallet },
        this.token
      );
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  async redeemBonus({ amount, type }) {
    const payload = {
      amount: +amount,
      type,
    };
    try {
      return await fetchAPI("user/redeem-bonus", "POST", payload, this.token);
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }

  async updateCryptoWalletBalance(updateBalanceData) {
    try {
      const { transactionId } = updateBalanceData?.updateBalanceData || updateBalanceData || {};

      if (!transactionId) {
        throw new Error("Transaction ID is required");
      }

      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      if (this.token) {
        headers.append("Authorization", `Bearer ${this.token}`);
      }

      const payload = JSON.stringify({
        txId: transactionId,
      });

      const response = await fetch(
        `${API_URL}/wallet/crypto/deposit`,
        {
          method: "POST",
          headers: headers,
          body: payload,
          redirect: "follow",
        }
      );

      const data = await response.json();

      // Handle different response scenarios
      if (response.status === 400 && data.error === "Transaction ID already used") {
        // Transaction already processed - return success with existing data
        return {
          status: "confirmed",
          confirmedAmount: data.confirmedAmount,
          rewardKes: data.rewardKes,
          confirmedAt: data.confirmedAt,
          alreadyUsed: true,
        };
      }

      if (data.status === "waiting_confirmation") {
        // Transaction not found yet - return waiting status
        return {
          status: "waiting_confirmation",
          message: data.message || "No matching deposit found yet. Please try again later.",
        };
      }

      if (data.status === "confirmed") {
        // Transaction confirmed successfully
        return {
          status: "confirmed",
          confirmedAmount: data.confirmedAmount,
          rewardKes: data.rewardKes,
          confirmedAt: data.confirmedAt,
        };
      }

      // If we get here, something unexpected happened
      throw new Error(data.error || data.message || "Failed to process crypto deposit");
    } catch (error) {
      throw new Error(error?.message || "Something went wrong");
    }
  }
}
