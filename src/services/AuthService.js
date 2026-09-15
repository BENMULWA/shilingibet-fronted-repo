import { fetchAPI } from "../utils/FetchApi";
import { normalizeKenyanPhone } from "../utils/phone";
import BaseClass from "./BaseClass";

const normalizeAuthResponse = (response) => {
  const payload = response?.data ?? response ?? {};
  const user = payload?.user ?? payload?.profile ?? payload;
  const token =
    payload?.token ?? payload?.accessToken ?? payload?.access_token ?? null;

  return {
    ...response,
    status: response?.success ?? response?.status ?? true,
    token,
    user,
  };
};

export class AuthService extends BaseClass {
  constructor() {
    super();
  }
  async logIn({ phone, password }) {
    try {
      const response = await fetchAPI("users/login", "POST", {
        phone: normalizeKenyanPhone(phone),
        password,
      });
      return normalizeAuthResponse(response);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }

  async register({ phone, password, referralCode = "" }) {
    try {
      const response = await fetchAPI("users/register", "POST", {
        phone: normalizeKenyanPhone(phone),
        password,
        ...(referralCode ? { referralCode } : {}),
      });
      return normalizeAuthResponse(response);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }

  async forgotPassword({ phone }) {
    try {
      return await fetchAPI("users/request-password-reset", "POST", {
        phone: normalizeKenyanPhone(phone),
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }

  async resetPassword({ phone, otp, newPassword }) {
    try {
      return await fetchAPI("users/reset-password", "POST", {
        phone: normalizeKenyanPhone(phone),
        code: String(otp).trim(),
        newPassword,
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }

  async deleteAccount({ duration }) {
    void duration;
    throw new Error("Account deletion is not supported by the new backend.");
  }

  async logOut() {
    this.clearUser();
    return { success: true, status: true, message: "Logged out" };
  }

  async activateAccount({ code, phone }) {
    try {
      const response = await fetchAPI("users/verify-phone", "POST", {
        phone: normalizeKenyanPhone(phone),
        code: String(code).trim(),
      });
      return normalizeAuthResponse(response);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }
  async resendActivationCode({ phone }) {
    try {
      return await fetchAPI("users/resend-phone-code", "POST", {
        phone: normalizeKenyanPhone(phone),
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error(error?.message || "Something went wrong");
    }
  }
}
