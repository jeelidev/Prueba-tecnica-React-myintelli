import {
  Outlet,
  Link
} from "react-router";
import { AppSidebar } from "~/components/app-sidebar"
import { NavActions } from "~/components/nav-actions"
import {  getSession } from "~/lib/sessionManager.server"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb"
import BreadTitle from "~/components/ui/breadTitle"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import type { Route} from "./+types/dashboard";
import { useLoaderData } from "react-router";
import  authMiddleware  from "~/middleware/authMiddleware"
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard Jeelidev App" },
    { name: "description", content: "Dashboard" },
  ];
}
import { useNavigation } from "react-router";
import { Spinner } from "~/components/ui/spinner"


export async function loader({ request, context }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const defaultReturnData = {
    fullName: "Faltante",
    email: "Faltante",
    modules: []
    
  }
  const rawUserData = session.get("userData")
  if (rawUserData) {
    const userDataParser = JSON.parse(rawUserData)
    defaultReturnData.fullName = userDataParser?.fullName
    defaultReturnData.email = userDataParser?.email
    defaultReturnData.modules = userDataParser?.modules

  }
  return defaultReturnData
}


export default function index() {
  const navegation = useNavigation()
  const inNavecation = navegation.state != "idle" 
  const { fullName, email, modules} = useLoaderData<typeof loader>()
  return (
    <SidebarProvider>
      <AppSidebar fullName={fullName} email={email} modules={ modules} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    <BreadTitle/>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 pt-10">
          <Outlet/>
        </div>
        {inNavecation && <div className="fixed size-svh flex justify-center items-center bg-(--background-transparen-loader)">
          <Spinner/>
        </div>}
      </SidebarInset>
    </SidebarProvider>
  )
}
export const middleware = [authMiddleware];
