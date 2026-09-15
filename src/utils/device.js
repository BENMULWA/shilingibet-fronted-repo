export function isMobilePaymentClient() {
  if (typeof window === "undefined") return false;

  const hasCoarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;

  const mobileUserAgent =
    typeof navigator !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ""
    );

  return hasCoarsePointer || mobileUserAgent;
}
