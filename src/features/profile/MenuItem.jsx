import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

function MenuItem({
  icon,
  label,
  textColor = "text-[#b7c4ba]",
  route,
  onClick,
}) {
  const content = (
    <div
      onClick={onClick}
      className={`flex items-center justify-between cursor-pointer hover:opacity-80 ${textColor}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon with rounded background */}
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 ${textColor}`}
        >
          {icon}
        </div>

        {/* Label */}
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      </div>
      <span className={textColor}>
        <HiChevronRight />
      </span>
    </div>
  );

  return (
    <li className="list-none">
      {route ? (
        <Link to={`/${route}`} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

export default MenuItem;
