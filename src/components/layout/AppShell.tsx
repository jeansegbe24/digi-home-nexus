import type { ReactNode } from "react";
import { AppSidebar, MobileNav } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="lg:pl-72">
        <TopBar title={title} subtitle={subtitle} />
        <main className="px-6 lg:px-10 py-8 pb-28 lg:pb-12 animate-fade-in">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
