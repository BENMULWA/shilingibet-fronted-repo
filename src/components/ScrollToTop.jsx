import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo(0, 0);

    // Also handle document scrolling
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Handle the main content scrollable container
    const mainContent = document.querySelector(".appscroll");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    // Handle any element with overflow-y-auto
    const scrollContainers = document.querySelectorAll(".overflow-y-auto");
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
