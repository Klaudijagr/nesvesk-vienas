"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";
import { memo, useCallback } from "react";
import type { HolidayDate } from "@/lib/types";
import { HOLIDAY_DATES } from "@/lib/types";

type IconType = "check" | "question" | "x";
type ColorType = "green" | "amber" | "red";
type HostingStatus = "can-host" | "may-host" | "cant-host";
type GuestStatus = "looking" | "maybe-guest" | "not-looking";

type PreferenceOption = {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
  colorType: ColorType;
  showDates: boolean;
};

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
    border: "border-green-500",
    bg: "bg-green-50",
    iconBg: "bg-green-600",
    title: "text-green-900",
    desc: "text-green-700",
    dateSelected: "bg-green-600 text-white border-green-600",
    dateUnselected:
      "bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400",
  },
  amber: {
    border: "border-amber-500",
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
    title: "text-amber-900",
    desc: "text-amber-700",
    dateSelected: "bg-amber-500 text-white border-amber-500",
    dateUnselected:
      "bg-white border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400",
  },
  red: {
    border: "border-red-500",
    bg: "bg-red-50",
    iconBg: "bg-red-600",
    title: "text-red-900",
    desc: "text-red-700",
    dateSelected: "bg-red-600 text-white border-red-600",
    dateUnselected:
      "bg-white border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400",
  },
} as const;

const IconBadge = memo(function IconBadgeInner({
  type,
  colorType,
  isSelected,
}: {
  type: IconType;
  colorType: ColorType;
  isSelected: boolean;
}) {
  const bgColor = isSelected ? COLOR_SCHEMES[colorType].iconBg : "bg-gray-400";

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
});

const DateButton = memo(function DateButtonInner({
  date,
  isSelected,
  colorType,
  onToggle,
}: {
  date: string;
  isSelected: boolean;
  colorType: ColorType;
  onToggle: (date: string) => void;
}) {
  const c = COLOR_SCHEMES[colorType];

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-md border px-2 py-1 font-medium text-xs transition-colors ${
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
});

const PreferenceCard = memo(function PreferenceCardInner({
  option,
  isSelected,
  onSelect,
  selectedDates,
  onToggleDate,
}: {
  option: PreferenceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  selectedDates: string[];
  onToggleDate: (date: string) => void;
}) {
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
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
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
          className={`mb-0.5 font-bold text-sm ${
            isSelected ? c.title : "text-gray-800"
          }`}
        >
          {option.title}
        </h3>
        <p className={`text-xs ${isSelected ? c.desc : "text-gray-500"}`}>
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
            <p className={`mb-2 pt-2 font-medium text-xs ${c.title}`}>
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
});

type ProfilePreferenceCardsProps = {
  hostingStatus: HostingStatus;
  guestStatus: GuestStatus;
  availableDates: HolidayDate[];
  onHostingChange: (status: HostingStatus) => void;
  onGuestChange: (status: GuestStatus) => void;
  onDatesChange: (dates: HolidayDate[]) => void;
};

export function ProfilePreferenceCards({
  hostingStatus,
  guestStatus,
  availableDates,
  onHostingChange,
  onGuestChange,
  onDatesChange,
}: ProfilePreferenceCardsProps) {
  const handleHostingSelect = useCallback(
    (id: string) => {
      onHostingChange(id as HostingStatus);
    },
    [onHostingChange]
  );

  const handleGuestSelect = useCallback(
    (id: string) => {
      onGuestChange(id as GuestStatus);
    },
    [onGuestChange]
  );

  const toggleDate = useCallback(
    (date: string) => {
      const holidayDate = date as HolidayDate;
      const newDates = availableDates.includes(holidayDate)
        ? availableDates.filter((d) => d !== holidayDate)
        : [...availableDates, holidayDate];
      onDatesChange(newDates);
    },
    [availableDates, onDatesChange]
  );

  return (
    <div className="space-y-6">
      {/* Hosting Section */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Are you open to hosting?</h3>
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
        <h3 className="font-semibold text-sm">
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
}
