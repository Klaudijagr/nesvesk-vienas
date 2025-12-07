import { Check, HelpCircle, X } from "lucide-react";
import type React from "react";

type IconWrapperProps = {
  type: "check" | "question" | "x";
  isSelected: boolean;
};

const IconWrapper: React.FC<IconWrapperProps> = ({ type, isSelected }) => {
  // Determine background color based on selection state and icon type logic from screenshot
  // Active items use the Teal brand color. Inactive use gray.
  const bgColorClass = isSelected ? "bg-teal-600" : "bg-gray-400";

  return (
    <div
      className={`rounded-full p-2 ${bgColorClass} transition-colors duration-200`}
    >
      {type === "check" && (
        <Check className="h-6 w-6 text-white" strokeWidth={3} />
      )}
      {type === "question" && (
        <HelpCircle className="h-6 w-6 text-white" strokeWidth={3} />
      )}
      {type === "x" && <X className="h-6 w-6 text-white" strokeWidth={3} />}
    </div>
  );
};

export default IconWrapper;
