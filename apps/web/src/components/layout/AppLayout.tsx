import type { ReactNode } from "react";
import { SidebarNav } from "../navigation/SidebarNav";
import { TopBar } from "./TopBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <SidebarNav />
      <div className="flex-1">
        <TopBar />
        <main>{children}</main>
      </div>
    </div>
  );
}
