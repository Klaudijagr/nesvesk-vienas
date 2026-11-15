"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";
import { memo, useCallback } from "react";

import type { HolidayDate } from "@/lib/types";
import { HOLIDAY_DATES } from "@/lib/types";

type IconType = "check" | "question" | "x";
type ColorType = "green" | "amber" | "red";
type HostingStatus = "can-host" | "may-host" | "cant-host";
type GuestStatus = "looking" | "maybe-guest" | "not-looking";

interface PreferenceOption {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
  colorType: ColorType;
  showDates: boolean;
}

const HOSTING_OPTIONS: PreferenceOption[] = [
  {
    id: "can-host",
    title: "I Can Host",
    description: "I'm eager to welcome guests",
    iconType: "check",
    colorType: "green",
    showDates: true,
  },
  {
    id: "may-host",
    title: "Maybe",
    description: "Depending on circumstances",
    iconType: "question",
    colorType: "amber",
    showDates: true,
  },
  {
    id: "cant-host",
    title: "Not Hosting",
    description: "Not able to host this season",
    iconType: "x",
    colorType: "red",
    showDates: false,
  },
];

const GUEST_OPTIONS: PreferenceOption[] = [
  {
    id: "looking",
    title: "Looking for Host",
    description: "Looking for somewhere to celebrate",
    iconType: "check",
    colorType: "green",
    showDates: true,
  },
  {
    id: "maybe-guest",
    title: "Open to It",
    description: "Might be interested",
    iconType: "question",
    colorType: "amber",
    showDates: true,
  },
  {
    id: "not-looking",
    title: "Not Looking",
    description: "Not looking for a host",
    iconType: "x",
    colorType: "red",
    showDates: false,
  },
];

const COLOR_SCHEMES = {
  green: {
    border: "border-success",
    bg: "bg-success/5",
    iconBg: "bg-success",
    title: "text-success-strong",
    desc: "text-success-strong",
    dateSelected: "bg-success text-white border-success",
    dateUnselected:
      "bg-white border-success/40 text-success-strong hover:bg-success/5 hover:border-success/70",
  },
  amber: {
    border: "border-gold-rich",
    bg: "bg-gold-soft/50",
    iconBg: "bg-gold-rich",
    title: "text-gold-deep",
    desc: "text-gold-deep",
    dateSelected: "bg-gold-rich text-white border-gold-rich",
    dateUnselected:
      "bg-white border-gold/80 text-gold-deep hover:bg-gold-soft/50 hover:border-gold",
  },
  red: {
    border: "border-destructive",
    bg: "bg-destructive/5",
    iconBg: "bg-destructive",
    title: "text-destructive-strong",
    desc: "text-destructive-strong",
    dateSelected: "bg-destructive text-white border-destructive",
    dateUnselected:
      "bg-white border-destructive/40 text-destructive-strong hover:bg-destructive/5 hover:border-destructive/70",
  },
} as const;

const IconBadgeInner = ({
  type,
  colorType,
  isSelected,
}: {
  type: IconType;
  colorType: ColorType;
  isSelected: boolean;
}) => {
  const bgColor = isSelected
    ? COLOR_SCHEMES[colorType].iconBg
    : "bg-muted-foreground/60";

  return (
    <div className={`rounded-full p-2 ${bgColor} transition-colors`}>
      {type === "check" && (
        <Check className="h-4 w-4 text-white" strokeWidth={3} />
      )}
      {type === "question" && (
        <HelpCircle className="h-4 w-4 text-white" strokeWidth={3} />
      )}
      {type === "x" && <X className="h-4 w-4 text-white" strokeWidth={3} />}
    </div>
  );
};

const IconBadge = memo(IconBadgeInner);

const DateButtonInner = ({
  date,
  isSelected,
  colorType,
  onToggle,
}: {
  date: HolidayDate;
  isSelected: boolean;
  colorType: ColorType;
  onToggle: (date: HolidayDate) => void;
}) => {
  const c = COLOR_SCHEMES[colorType];

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
        isSelected ? c.dateSelected : c.dateUnselected
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(date);
      }}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {date}
    </motion.button>
  );
};

const DateButton = memo(DateButtonInner);

const PreferenceCardInner = ({
  option,
  isSelected,
  onSelect,
  selectedDates,
  onToggleDate,
}: {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedDates: HolidayDate[];
  onToggleDate: (date: HolidayDate) => void;
}) => {
  const c = COLOR_SCHEMES[option.colorType];
  const showDates = isSelected && option.showDates;

  const handleSelect = useCallback(() => {
    onSelect(option.id);
  }, [onSelect, option.id]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 transition-colors duration-200 ${
        isSelected
          ? `${c.border} ${c.bg} shadow-md`
          : "border-border hover:border-muted-foreground/30 bg-white hover:shadow-sm"
      }`}
    >
      <button
        className="flex w-full cursor-pointer flex-col items-center p-4 text-center"
        onClick={handleSelect}
        type="button"
      >
        <div className="mb-2">
          <IconBadge
            colorType={option.colorType}
            isSelected={isSelected}
            type={option.iconType}
          />
        </div>
        <h3
          className={`mb-0.5 text-sm font-bold ${
            isSelected ? c.title : "text-foreground"
          }`}
        >
          {option.title}
        </h3>
        <p
          className={`text-xs ${isSelected ? c.desc : "text-muted-foreground"}`}
        >
          {option.description}
        </p>
      </button>

      {showDates && (
        <motion.div
          animate={{ opacity: 1 }}
          className={`border-t ${c.border} px-3 pb-3`}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -10, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <p className={`mb-2 pt-2 text-xs font-medium ${c.title}`}>
              Select dates:
            </p>
            <div className="flex flex-wrap gap-1">
              {HOLIDAY_DATES.map((date, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  key={date}
                  transition={{ delay: 0.03 * index, duration: 0.2 }}
                >
                  <DateButton
                    colorType={option.colorType}
                    date={date}
                    isSelected={selectedDates.includes(date)}
                    onToggle={onToggleDate}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

const PreferenceCard = memo(PreferenceCardInner);

const isHostingStatus = (id: string): id is HostingStatus =>
  id === "can-host" || id === "may-host" || id === "cant-host";

const isGuestStatus = (id: string): id is GuestStatus =>
  id === "looking" || id === "maybe-guest" || id === "not-looking";

interface ProfilePreferenceCardsProps {
  hostingStatus: HostingStatus;
  guestStatus: GuestStatus;
  availableDates: HolidayDate[];
  onHostingChange: (status: HostingStatus) => void;
  onGuestChange: (status: GuestStatus) => void;
  onDatesChange: (dates: HolidayDate[]) => void;
}

export const ProfilePreferenceCards = ({
  hostingStatus,
  guestStatus,
  availableDates,
  onHostingChange,
  onGuestChange,
  onDatesChange,
}: ProfilePreferenceCardsProps) => {
  const handleHostingSelect = useCallback(
    (id: string) => {
      if (isHostingStatus(id)) {
        onHostingChange(id);
      }
    },
    [onHostingChange]
  );

  const handleGuestSelect = useCallback(
    (id: string) => {
      if (isGuestStatus(id)) {
        onGuestChange(id);
      }
    },
    [onGuestChange]
  );

  const toggleDate = useCallback(
    (date: HolidayDate) => {
      const newDates = availableDates.includes(date)
        ? availableDates.filter((d) => d !== date)
        : [...availableDates, date];
      onDatesChange(newDates);
    },
    [availableDates, onDatesChange]
  );

  return (
    <div className="space-y-6">
      {/* Hosting Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Are you open to hosting?</h3>
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          {HOSTING_OPTIONS.map((option) => (
            <PreferenceCard
              isSelected={hostingStatus === option.id}
              key={option.id}
              onSelect={handleHostingSelect}
              onToggleDate={toggleDate}
              option={option}
              selectedDates={availableDates}
            />
          ))}
        </div>
      </div>

      {/* Guest Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">
          Are you looking to be a guest?
        </h3>
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-3">
          {GUEST_OPTIONS.map((option) => (
            <PreferenceCard
              isSelected={guestStatus === option.id}
              key={option.id}
              onSelect={handleGuestSelect}
              onToggleDate={toggleDate}
              option={option}
              selectedDates={availableDates}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
