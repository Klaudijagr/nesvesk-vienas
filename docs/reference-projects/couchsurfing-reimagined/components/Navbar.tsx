import {
  LayoutDashboard,
  Mail,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import type React from "react";
import type { ViewState } from "../types";

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewState) =>
    `flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
      currentView === view
        ? "text-orange-600 border-b-2 border-orange-600"
        : "text-gray-600 hover:text-orange-500 hover:bg-gray-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 h-16 border-gray-200 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center gap-6">
          <div className="cursor-pointer" onClick={() => setView("dashboard")}>
            {/* Logo Imitation */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 p-1.5 font-bold font-serif text-white text-xl italic shadow-sm transition-colors hover:bg-orange-600">
              Cs
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex h-full items-center gap-2">
          <button
            className={navItemClass("dashboard")}
            onClick={() => setView("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={navItemClass("inbox")}
            onClick={() => setView("inbox")}
          >
            <div className="relative">
              <Mail size={20} />
              <span className="-top-1 -right-1 absolute flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                3
              </span>
            </div>
            <span>Inbox</span>
          </button>
          <button
            className={navItemClass("profile")}
            onClick={() => setView("profile")}
          >
            <User size={20} />
            <span>Profile</span>
          </button>
          <button
            className={navItemClass("settings")}
            onClick={() => setView("settings")}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
