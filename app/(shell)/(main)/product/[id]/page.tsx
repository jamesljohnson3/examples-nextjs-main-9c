import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import App from "./app"

export default async function Page({ params }: { params: { id: string } }) {
  const { cookies } = await import("next/headers")
  return ( <App params={params}/>
  )
}
