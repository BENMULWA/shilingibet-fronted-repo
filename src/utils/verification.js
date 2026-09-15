export function isUserPhoneVerified(user) {
  if (!user || typeof user !== "object") {
    return false;
  }

  const truthyFlags = [
    user.isActive,
    user.isVerified,
    user.phoneVerified,
    user.contactVerified,
  ];

  if (truthyFlags.some((value) => value === true || value === "true" || value === 1)) {
    return true;
  }

  if (user.phoneVerifiedAt || user.verifiedAt || user.contactVerifiedAt) {
    return true;
  }

  return false;
}
