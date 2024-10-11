"use client";
import { SidebarDemo } from "../components/Sidebar";
export default function AdminDashboardLayout({ children }) {
  return (
    <SidebarDemo>
        {children}
    </SidebarDemo>
  );
}
