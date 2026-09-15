import { lazy, Suspense, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import BottomNav from "../layouts/BottomNav";
import DownloadBanner from "../components/DownloadBanner";
import Sidebar from "../layouts/Sidebar";
import HomePage from "../pages/HomePage";
import { getStoredUser } from "../utils/authStorage";

const AppDownloadPopup = lazy(() => import("../components/AppDownloadPopup"));
const FloatingActions = lazy(() => import("../components/FloatingActions"));
const ChatPanel = lazy(() => import("../features/chat/ChatPanel"));

function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const chatWidth = chatCollapsed ? 320 : 380;
  const isSomethingOpen = showSidebar || isAppModalOpen || showChat;

  const closeAll = () => {
    setShowSidebar(false);
    setIsAppModalOpen(false);
    setShowChat(false);
  };

  const user = getStoredUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 1024) setCollapsed(true);
      if (window.innerWidth >= 1024) setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const openSupportChat = () => setShowChat(true);
    window.addEventListener("open-support-chat", openSupportChat);
    return () => window.removeEventListener("open-support-chat", openSupportChat);
  }, []);

  useEffect(() => {
    let frameOne = 0;
    let frameTwo = 0;

    frameOne = window.requestAnimationFrame(() => {
      frameTwo = window.requestAnimationFrame(() => {
        window.hideBootSplash?.();
      });
    });

    return () => {
      window.cancelAnimationFrame(frameOne);
      window.cancelAnimationFrame(frameTwo);
    };
  }, []);

  // Show popup once on first visit
  useEffect(() => {
    const seen = localStorage.getItem("seenAppPopup");
    if (!seen) {
      setIsAppModalOpen(true);
      localStorage.setItem("seenAppPopup", "true");
    }
  }, []);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isSomethingOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isSomethingOpen]);

  const cleanToken = user?.token?.replace("Bearer ", "");
  const isAuthOverlayRoute = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset",
    "/verify",
  ].includes(location.pathname);
  const isGameRoute =
    location.pathname === "/aviator" ||
    location.pathname.startsWith("/virtual/");

  return (
    <div
      className="betting-table-bg flex flex-col h-screen text-textColor no-scrollbar transition-all duration-300"
      style={{ marginRight: showChat && !isMobile ? `${chatWidth}px` : "0px" }}
    >
      <DownloadBanner />
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} onMenuClick={() => setShowSidebar(true)} />

      <div
        className={`relative z-[1] flex flex-1 overflow-hidden no-scrollbar md:gap-2 lg:gap-2 ${
          isGameRoute ? "p-0 md:px-2 md:pt-4" : "px-0 pt-4 md:px-2"
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
        <main
          className={`flex-1 overflow-y-auto pb-12 appscroll no-scrollbar md:pb-0 ${
            isGameRoute ? "overflow-hidden" : ""
          }`}
        >
          <div
            className={`mx-auto w-full max-w-[3000px] ${
              isGameRoute ? "p-0" : "lg:px-4 2xl:px-8"
            }`}
          >
            {isAuthOverlayRoute && <HomePage />}
            <Outlet />
          </div>
        </main>
      </div>

      {isMobile && !isGameRoute && (
        <BottomNav
          onMenuClick={() => setShowSidebar(true)}
          onChatClick={() => setShowChat((prev) => !prev)}
          closeAll={closeAll}
          isSomethingOpen={isSomethingOpen}
        />
      )}

      {isAppModalOpen && (
        <Suspense fallback={null}>
          <AppDownloadPopup isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <FloatingActions onOpenChat={() => setShowChat(true)} />
      </Suspense>

      {showChat && (
        <Suspense fallback={null}>
          <ChatPanel
            token={cleanToken}
            open={showChat}
            onClose={() => setShowChat(false)}
            collapsed={chatCollapsed}
            onToggleCollapse={() => setChatCollapsed((prev) => !prev)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default DashboardLayout;
