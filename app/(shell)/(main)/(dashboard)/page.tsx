import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Process from "./process"
export default async function Page() {
  const { cookies } = await import("next/headers")
  return ( <Process/>
  )
}
