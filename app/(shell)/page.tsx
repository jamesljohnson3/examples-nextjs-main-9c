import { Dashboard } from "@/components/Dashboard/Dashboard";
import { AppSidebar } from "@/components/Sidebar/Sidebar";
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Home() {
  const { cookies } = await import("next/headers")

  return (
    <SidebarLayout
    defaultOpen={cookies().get("sidebar:state")?.value === "true"}
  >
      <AppSidebar />
      <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="bg-white dark:bg-black rounded-lg h-full pb-4 shadow">
          <SidebarTrigger />
        </div>
      </main>
    </SidebarLayout>
  );
}
