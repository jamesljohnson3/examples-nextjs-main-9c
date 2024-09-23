import { ApolloWrapper } from "./ApolloWrapper";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"




export default async function Layout({ children }: React.PropsWithChildren) {

  const { cookies } = await import("next/headers")
  return (
    <ApolloWrapper>
<SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
              <AppSidebar />
        <main className="flex flex-1 flex-col  p-2 h-full rounded-md  transition-all duration-300 ease-in-out">
             {children}
         </main>
      </SidebarLayout>
    </ApolloWrapper>
  );
}