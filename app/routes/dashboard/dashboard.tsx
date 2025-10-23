import { Outlet } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { NavActions } from "~/components/nav-actions";
import { getSession } from "~/lib/sessionManager.server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import BreadTitle from "~/components/ui/breadTitle";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import type { Route } from "./+types/dashboard";
import { useLoaderData, useNavigation } from "react-router";
import authMiddleware from "~/middleware/authMiddleware";
import { Spinner } from "~/components/ui/spinner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Dashboard Jeelidev App" },
    { name: "description", content: "Dashboard" },
  ];
}

export async function loader({ request, context }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const defaultReturnData = {
    fullName: "Faltante",
    email: "Faltante",
    modules: [],
  };
  const rawUserData = session.get("userData");
  if (rawUserData) {
    const userDataParser = JSON.parse(rawUserData);
    defaultReturnData.fullName = userDataParser?.fullName;
    defaultReturnData.email = userDataParser?.email;
    defaultReturnData.modules = userDataParser?.modules;
  }
  return defaultReturnData;
}

export default function DashboardLayout() {
  const navegation = useNavigation();
  const inNavecation = navegation.state !== "idle";
  const { fullName, email, modules } = useLoaderData<typeof loader>();

  return (
    <SidebarProvider>
      <AppSidebar fullName={fullName} email={email} modules={modules} />
      <SidebarInset className="flex flex-col h-screen bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 z-10 bg-background">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    <BreadTitle />
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto">
            <NavActions />
          </div>
        </header>

        <main id="main-general" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {inNavecation && (
          <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-50">
            <Spinner />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

export const middleware = [authMiddleware];