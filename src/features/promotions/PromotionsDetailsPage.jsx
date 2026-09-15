import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { FaArrowLeft } from "react-icons/fa";
import { promotionsData } from "../../utils/configs";
import { useState } from "react";
import DepositModal from "../../features/payment/DepositModal";

function PromotionsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const promo = promotionsData[id];
  const [openDeposit, setOpenDeposit] = useState(false);

  if (!promo) {
    return (
      <div className="text-center text-[#b7c4ba] py-10">Promotion not found</div>
    );
  } // Handle CTA actions
  const handleCTA = () => {
    if (id === "registration" || id === "refer") {
      navigate("/refer");
    } else if (id === "daily-cashback") {
      setOpenDeposit(true);
    } else if (id === "aviator-daily" || id === "aviator-challenges") {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-[#b7c4ba]">
      <div className="max-w-4xl mx-auto p-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary mb-6 hover:underline"
        >
          <FaArrowLeft /> To promotions
        </button>

        {/* Title */}
        <h4 className="text-lg md:text-2xl font-bold text-primary text-left mb-6">
          {promo.title}
        </h4>

        {/* Banner */}
        <div className="w-full rounded-lg overflow-hidden shadow-md mb-6">
          <img
            src={promo.image}
            alt={promo.title}
            className="w-full h-auto object-cover"
            decoding="async"
          />
        </div>

        {/* Intro */}
        {promo.intro && (
          <p className="text-[#b7c4ba] leading-relaxed mb-8 text-center md:text-left">
            {promo.intro}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-600 my-6" />

        {/* How to get started */}
        {promo.steps && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {promo.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mb-3">
                    {i + 1}
                  </div>
                  <p className="text-[#b7c4ba]">{step}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Extra note */}
        {promo.note && (
          <p className="text-sm italic text-center text-[#9cae9f] mt-8">
            {promo.note}
          </p>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleCTA}
            className="bg-primary hover:bg-primary/80 text-black font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            To rewards
          </button>
        </div>
      </div>
      <Footer /> {/* Deposit Modal */}
      {openDeposit && <DepositModal onClose={() => setOpenDeposit(false)} />}
    </div>
  );
}

export default PromotionsDetails;
