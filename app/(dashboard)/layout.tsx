"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar - full height on left */}
      <AppSidebar />

      {/* Right side: Header + Content + Footer */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar - only spans content area */}
        <TopBar />

        {/* Main content area - scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>

        {/* Footer - spans content area */}
        <footer className="shrink-0 border-t bg-gray-50 py-3">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Nešvęsk Vienas. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
