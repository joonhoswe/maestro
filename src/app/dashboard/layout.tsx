"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProtectedRoute from "@/components/auth/protected-route";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-white">
          <AppSidebar />
          <div className="flex-1 overflow-auto bg-white">
            <main className="min-h-screen">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
