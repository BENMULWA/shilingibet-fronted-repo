const RAW_API_URL = import.meta.env.VITE_API_URL || "";

function normalizePathname(pathname = "") {
  return pathname.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  if (!RAW_API_URL) {
    return "";
  }

  if (import.meta.env.DEV) {
    try {
      const parsed = new URL(RAW_API_URL);
      return normalizePathname(parsed.pathname);
    } catch {
      return normalizePathname(RAW_API_URL);
    }
  }

  return normalizePathname(RAW_API_URL);
}

export function getApiOrigin() {
  if (!RAW_API_URL) {
    return "";
  }

  try {
    return new URL(RAW_API_URL).origin;
  } catch {
    return "";
  }
}
