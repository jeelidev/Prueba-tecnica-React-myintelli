import * as React from "react"
import {

  CornerUpRight,
  MoreHorizontal
} from "lucide-react"
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = [
  [
    {
      label: "Salir de session",
      icon: CornerUpRight,
    }
    ]
]

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
  const LogOut = async () => {
    console.log("Ejecutado desde el navegador")
    setIsLoading(true);
    try {
      const response = await fetch("/dashboard/log-out", {
        method: "GET",
        credentials: "include", 
      });

      if (response.ok) {
        console.log("Logout exitoso, redirigiendo a home...");
        navigate("/");
      } else {
        console.error("Falló el logout");
      }
    } catch (error) {
      console.error("Error de red durante el logout:", error);
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div className="flex items-center gap-2 text-sm">
      <Button variant="ghost" size="icon" className="h-7 w-7">
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="data-[state=open]:bg-accent h-7 w-7"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton onClick={()=>{LogOut()}} disabled={isLoading}>
                            <item.icon /> <span>{isLoading ? "Cerrando sesión..." : item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
