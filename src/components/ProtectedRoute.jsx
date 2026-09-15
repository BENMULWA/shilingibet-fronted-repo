import { Navigate, useLocation } from "react-router-dom";
import BaseClass from "../services/BaseClass";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const base = new BaseClass();
  const phone = base.phone;

  if (!base.isPhoneVerified() && phone) {
    return (
      <Navigate
        to={`/verify?phone=${encodeURIComponent(phone)}`}
        state={{ phone, from: location }}
        replace
      />
    );
  }

  if (!base.isPhoneVerified() && base.user) {
    base.clearUser();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!base.isAuthenticated() || base.token === "fake-dev-token") {
    base.clearUser();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
