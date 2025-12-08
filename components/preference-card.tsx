import { Check, HelpCircle, X } from "lucide-react";

export type IconType = "check" | "question" | "x";

type PreferenceOption = {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
};

type PreferenceCardProps = {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

function IconWrapper({
  type,
  isSelected,
}: {
  type: IconType;
  isSelected: boolean;
}) {
  const bgColorClass = isSelected ? "bg-red-600" : "bg-gray-400";

  return (
    <div
      className={`rounded-full p-3 ${bgColorClass} transition-colors duration-200`}
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
}

export function PreferenceCard({
  option,
  isSelected,
  onSelect,
}: PreferenceCardProps) {
  return (
    <button
      className={`relative flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-all duration-200 ${
        isSelected
          ? "border-red-500 bg-red-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
      }`}
      onClick={() => onSelect(option.id)}
      type="button"
    >
      <div className="mb-4">
        <IconWrapper isSelected={isSelected} type={option.iconType} />
      </div>

      <h3
        className={`mb-2 font-bold text-lg ${
          isSelected ? "text-red-900" : "text-gray-800"
        }`}
      >
        {option.title}
      </h3>

      <p className={`text-sm ${isSelected ? "text-red-700" : "text-gray-500"}`}>
        {option.description}
      </p>
    </button>
  );
}

// Pre-defined option sets for hosting and meetup
export const HOSTING_OPTIONS: PreferenceOption[] = [
  {
    id: "can-host",
    title: "I Can Host",
    description: "I'm eager to welcome guests for the holidays",
    iconType: "check",
  },
  {
    id: "may-host",
    title: "Maybe",
    description: "I might be able to host, depending on circumstances",
    iconType: "question",
  },
  {
    id: "cant-host",
    title: "Not Hosting",
    description: "I'm not able to host this holiday season",
    iconType: "x",
  },
];

export const GUEST_OPTIONS: PreferenceOption[] = [
  {
    id: "looking",
    title: "Looking for a Host",
    description: "I'm looking for somewhere to celebrate the holidays",
    iconType: "check",
  },
  {
    id: "maybe-guest",
    title: "Open to It",
    description: "I might be interested in joining a celebration",
    iconType: "question",
  },
  {
    id: "not-looking",
    title: "Not Looking",
    description: "I'm not looking for a host right now",
    iconType: "x",
  },
];
