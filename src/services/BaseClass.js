import { isUserPhoneVerified } from "../utils/verification";
import { clearStoredUser, getStoredUser } from "../utils/authStorage";

class BaseClass {
  // Get the current user from localStorage
  get user() {
    return getStoredUser();
  }

  // Get the token from user (always returns raw token without 'Bearer ' prefix)
  get token() {
    const raw = this.user?.token || null;
    // Strip 'Bearer ' prefix if the server stored it with one
    return raw ? raw.replace(/^Bearer\s+/i, "") : null;
  }

  // Get the userId
  get userId() {
    return this.user?.userId || this.user?._id || this.user?.id || null;
  }

  // Get the phone
  get phone() {
    return this.user?.phone || null;
  }

  // Get the email
  get email() {
    return this.user?.email || null;
  }

  // Phone verification follows the backend's `isActive` flag.
  isPhoneVerified() {
    return isUserPhoneVerified(this.user);
  }

  // Get the referralCode
  get referralCode() {
    return this.user?.referralCode || null;
  }
  // Get the Username
  get username() {
    return this.user?.username || null;
  }

  get firstName() {
    return (
      this.user?.first_name ||
      this.user?.firstName ||
      this.user?.firstname ||
      this.user?.name?.split?.(" ")?.[0] ||
      this.username?.split?.(" ")?.[0] ||
      null
    );
  }

  get lastName() {
    return (
      this.user?.last_name ||
      this.user?.lastName ||
      this.user?.lastname ||
      this.user?.name?.split?.(" ")?.slice?.(1)?.join?.(" ") ||
      this.username?.split?.(" ")?.slice?.(1)?.join?.(" ") ||
      null
    );
  }

  get airtimeBalance() {
    return Number(this.user?.airtimeBalance ?? 0);
  }

  get activeWallet() {
    return this.user?.activeWallet || "balance";
  }

  // Auth headers (auto-updates when token changes)
  get authHeaders() {
    return {
      Authorization: this.token ? `Bearer ${this.token}` : "",
      "Content-Type": "application/json",
    };
  }

  // Auth headers for JSON
  get authJsonHeaders() {
    return this.authHeaders;
  }

  // Check if token is expired
  isTokenExpired() {
    if (!this.token) return true;
    try {
      const payload = JSON.parse(atob(this.token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return now >= payload.exp;
    } catch {
      return true;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user && !this.isTokenExpired();
  }

  // Logout / clear user
  clearUser() {
    clearStoredUser();
  }
}

export default BaseClass;
