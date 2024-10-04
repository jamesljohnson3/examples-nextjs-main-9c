import { MainSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Dashboard } from "@/components/Dashboard/Dashboard";

export default async function Page() {
  const { cookies } = await import("next/headers")
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <MainSidebar />

      <Dashboard />

      
      
    </SidebarLayout>
  )
}
