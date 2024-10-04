import { MainSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { AppSidebar } from "@/components/Sidebar/Sidebar";

export default function Home() {
  return (
    <main className="grid gap-4 p-4 grid-cols-1 md:grid-cols-[220px,_1fr]">
      <AppSidebar />
      <Dashboard />
    </main>
  );
}
