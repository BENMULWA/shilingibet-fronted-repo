import { useNavigate } from "react-router-dom";

function PromotionsCard({ id, src, title, description }) {
  const navigate = useNavigate();
  return (
    <div className="bg-secondary border border-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all flex flex-col">
      {/* Banner Image */}
      <div className="w-full h-48">
        <img
          className="w-full h-full object-cover object-center"
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Text Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-[#d7e1d9] text-lg font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-[#aab8ad] text-sm mt-2 leading-snug">
            {description}
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className="p-5 pt-0">
        <button
          onClick={() => navigate(`/promotions/${id}`)}
          className="w-full bg-primary text-black font-bold py-2.5 border-6 border-background rounded-2xl hover:bg-yellow-500 transition-colors"
        >
          Read More
        </button>
      </div>
    </div>
  );
}

export default PromotionsCard;
