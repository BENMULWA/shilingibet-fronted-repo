import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryHeader({
  title = "Category",
  onPrev,
  onNext,
  src,
  icon: Icon,
  provider = "imoon",
  showNav = true,
  viewAllState,
}) {
  return (
    <div className="flex items-center justify-between px-1 pb-2">
      <div className="flex items-center justify-center gap-2">
        {Icon ? (
          <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#b7c4ba]" />
        ) : src ? (
          <img src={src} className="h-6" alt={title} />
        ) : null}
        <h4 className="text-[#b7c4ba] md:text-md text-sm md:font-semibold font-semibold">
          {title}
        </h4>
      </div>

      {showNav && (
        <div className="flex gap-2">
          {/* View All */}
          {/* <Link }> */}
            <button
              className="bg-secondary text-[#b7c4ba] font-medium text-[10px] px-4 cursor-pointer p-2 rounded-lg 
            "
            >
              View All
            </button>
          {/* </Link> */}

          {/* Arrows */}
          <div className="flex rounded-lg overflow-hidden">
            <button
              onClick={onPrev}
              className="bg-secondary w-10 p-2 flex items-center cursor-pointer justify-center border-r border-primary/20 hover:brightness-110"
            >
              <ChevronLeft className="text-[#b7c4ba] w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="bg-secondary w-10 p-2 flex items-center cursor-pointer justify-center hover:brightness-110"
            >
              <ChevronRight className="text-[#b7c4ba] w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryHeader;
