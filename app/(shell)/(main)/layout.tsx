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
        <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
          <div className="h-full rounded-md ">
            {children}
          </div>
        </main>
      </SidebarLayout>
    </ApolloWrapper>
  );
}