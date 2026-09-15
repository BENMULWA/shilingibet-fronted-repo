import { useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaCoins, FaShoppingBag, FaUsers } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { BsGiftFill } from "react-icons/bs";

function BannerPopup({ open, onClose, bannerType }) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const startY = useRef(0);
  const modalRef = useRef(null);

  if (!open && !isClosing) return null;

  const banners = {
    referral: {
      title: "Referral Rewards!",
      subtitle: "Invite friends and earn amazing rewards!",
      buttonText: "Start Referring",
      route: "/refer",
      icon: FaUsers,
      emoji: "👥",
    },
    cashback: {
      title: "Cashback Bonus!",
      subtitle: "Get cashback on every bet you place!",
      buttonText: "Claim Cashback",
      route: "/profile",
      icon: FaCoins,
      emoji: "💰",
    },
    voucher: {
      title: "Shopping Vouchers!",
      subtitle: "Win exclusive shopping vouchers daily!",
      buttonText: "Get Vouchers",
      route: "/promotions",
      icon: FaShoppingBag,
      emoji: "🛍️",
    },
  };

  const bannerData = banners[bannerType] || banners.referral;
  const Icon = bannerData.icon;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    // Only allow dragging down
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged more than 100px, close the modal
    if (dragY > 100) {
      handleClose();
    }
    setDragY(0);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 transition-colors duration-300 ${isClosing ? "bg-black/0" : "bg-black/50"
        }`}
      onClick={handleClose}
    >
      {/* Modal Container - Bottom sheet on mobile, centered on desktop */}
      <div
        ref={modalRef}
        className={`relative w-full md:max-w-sm bg-secondary rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] md:max-h-[90vh] ${isClosing
            ? "animate-slide-down"
            : isDragging
              ? ""
              : "animate-slide-up"
          }`}
        style={{
          transform: isDragging ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle - Mobile only */}
        <div
          className="flex justify-center pt-3 pb-1 md:hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-white/20 rounded-full"></div>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <h2 className="text-xl font-bold text-[#d7e1d9] tracking-tight">
            {bannerData.title}
          </h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full
            hover:bg-white/10 transition-all duration-200"
          >
            <IoMdClose className="text-[#aab8ad] text-2xl" />
          </button>
        </div>

        {/* Content - Centered on mobile, normal on desktop */}
        <div className="flex-1 flex flex-col justify-center px-5 pb-6 md:pb-6">
          {/* Gift Illustration Container */}
          <div className="relative flex justify-center items-center py-8 md:py-6">
            {/* Background Glow */}
            <div className="absolute w-48 h-48 md:w-40 md:h-40 bg-primary rounded-full blur-3xl opacity-20" />

            {/* Floating Sparkles */}
            <HiSparkles className="absolute top-2 left-8 text-primary text-xl animate-pulse" />
            <HiSparkles className="absolute top-8 right-10 text-primary/80 text-base animate-pulse delay-100" />
            <HiSparkles className="absolute bottom-4 left-12 text-primary/60 text-sm animate-pulse delay-200" />

            {/* Main Gift Box */}
            <div className="relative">
              {/* Gift Box */}
              <div className="relative bg-primary p-1 rounded-2xl shadow-2xl shadow-primary/40">
                <div className="bg-secondary rounded-2xl p-8 md:p-6">
                  {/* Ribbon Top */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full">
                    <BsGiftFill className="text-black text-sm" />
                  </div>

                  {/* Icon */}
                  <div className="relative">
                    <Icon className="text-7xl md:text-6xl text-primary" />
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -right-6 top-0 w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-lg">{bannerData.emoji}</span>
              </div>
              <div className="absolute -left-5 bottom-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg animate-bounce delay-150">
                <span className="text-sm">🎁</span>
              </div>
              <div className="absolute -right-3 bottom-0 w-7 h-7 bg-primary/80 rounded-lg flex items-center justify-center shadow-lg animate-bounce delay-300">
                <span className="text-xs">✨</span>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-center text-[#d7e1d9] text-lg md:text-base mb-8 md:mb-6 px-4 md:px-2">
            {bannerData.subtitle}
          </p>

          {/* CTA Button */}
          <Link
            to={bannerData.route}
            onClick={handleClose}
            className="block w-full py-4 bg-primary hover:bg-primary/90
            text-black text-center font-bold text-lg rounded-sm
            shadow-lg shadow-primary/30 hover:shadow-primary/50
            transition-all duration-200 active:scale-[0.98]"
          >
            {bannerData.buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BannerPopup;
