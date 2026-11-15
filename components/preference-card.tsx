import { Check, HelpCircle, X } from "lucide-react";

export type IconType = "check" | "question" | "x";

interface PreferenceOption {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
}

interface PreferenceCardProps {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const IconWrapper = ({
  type,
  isSelected,
}: {
  type: IconType;
  isSelected: boolean;
}) => {
  const bgColorClass = isSelected ? "bg-brand" : "bg-muted-foreground/60";

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
};

export const PreferenceCard = ({
  option,
  isSelected,
  onSelect,
}: PreferenceCardProps) => (
  <button
    className={`relative flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-all duration-200 ${
      isSelected
        ? "border-brand bg-brand/5 shadow-md"
        : "border-border hover:border-muted-foreground/30 hover:bg-muted bg-white hover:shadow-sm"
    }`}
    onClick={() => {
      onSelect(option.id);
    }}
    type="button"
  >
    <div className="mb-4">
      <IconWrapper isSelected={isSelected} type={option.iconType} />
    </div>

    <h3
      className={`mb-2 text-lg font-bold ${
        isSelected ? "text-brand-strong" : "text-foreground"
      }`}
    >
      {option.title}
    </h3>

    <p
      className={`text-sm ${isSelected ? "text-brand-strong" : "text-muted-foreground"}`}
    >
      {option.description}
    </p>
  </button>
);

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
