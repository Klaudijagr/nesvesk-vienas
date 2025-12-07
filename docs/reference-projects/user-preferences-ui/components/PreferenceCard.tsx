import type React from "react";
import type { PreferenceOption } from "../types";
import IconWrapper from "./IconWrapper";

type PreferenceCardProps = {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

const PreferenceCard: React.FC<PreferenceCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => (
  <div
    className={`relative flex h-full min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-md border-2 p-6 text-center transition-all duration-200 ${
      isSelected
        ? "border-teal-500 bg-teal-50 shadow-sm"
        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
    }
      `}
    onClick={() => onSelect(option.id)}
  >
    <div className="mb-4">
      <IconWrapper isSelected={isSelected} type={option.iconType} />
    </div>

    <h3
      className={`mb-2 font-bold text-lg ${isSelected ? "text-teal-900" : "text-gray-800"}`}
    >
      {option.title}
    </h3>

    <p className={`text-sm ${isSelected ? "text-teal-700" : "text-gray-500"}`}>
      {option.description}
    </p>
  </div>
);

export default PreferenceCard;
