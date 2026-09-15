const USER_STORAGE_KEY = "user";
const PENDING_VERIFICATION_KEY = "pendingVerificationPhone";

function safeParseJson(value) {
  if (!value || value === "undefined") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return safeParseJson(localStorage.getItem(USER_STORAGE_KEY));
}

export function setStoredUser(user) {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function mergeStoredUser(patch) {
  if (!patch || typeof patch !== "object") {
    return getStoredUser();
  }

  const currentUser = getStoredUser() || {};
  const nextUser = { ...currentUser, ...patch };
  setStoredUser(nextUser);
  return nextUser;
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getPendingVerificationPhone() {
  return localStorage.getItem(PENDING_VERIFICATION_KEY) || "";
}

export function setPendingVerificationPhone(phone) {
  if (!phone) {
    localStorage.removeItem(PENDING_VERIFICATION_KEY);
    return;
  }

  localStorage.setItem(PENDING_VERIFICATION_KEY, phone);
}

export function clearPendingVerificationPhone() {
  localStorage.removeItem(PENDING_VERIFICATION_KEY);
}
