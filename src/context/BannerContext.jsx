import { createContext, useContext, useState } from "react";
import BannerPopup from "../components/BannerPopup";

const BannerContext = createContext();

export function BannerProvider({ children }) {
  const [popup, setPopup] = useState({ open: false, type: null });

  const showBanner = (type) => setPopup({ open: true, type });
  const closeBanner = () => setPopup({ open: false, type: null });

  return (
    <BannerContext.Provider value={{ showBanner, closeBanner }}>
      {children}
      <BannerPopup
        open={popup.open}
        bannerType={popup.type}
        onClose={closeBanner}
      />
    </BannerContext.Provider>
  );
}

// 👇 Add this so you can use it in Register
export function useBanner() {
  const context = useContext(BannerContext);
  if (context === undefined) {
    // Return safe defaults if used outside provider
    return {
      showBanner: () => {},
      closeBanner: () => {},
    };
  }
  return context;
}
