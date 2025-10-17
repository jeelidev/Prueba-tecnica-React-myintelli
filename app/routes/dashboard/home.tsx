import type { Route} from "./+types/home";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "~/components/ui/item"
import SetTitleBread from "~/components/triggersClient/setTitleBread"
import { MonitorSmartphone, Microscope } from "lucide-react"
import {NavLink} from "react-router"

export async function loader({ request, context }: Route.ActionArgs) {
  return null
}

export default function Home() {


    return (
        <div className="flex w-full justify-center">
            <SetTitleBread title="Bienvenido"/>
            <ItemGroup className="flex flex-row gap-4">
                <NavLink to="list-devices">
                    <Item className="max-w-[200px]" variant="outline">
                        <ItemHeader >
                        <MonitorSmartphone size={"100%"} />         
                        </ItemHeader>
                        <ItemContent>
                        <ItemTitle><h2 className="text-xl text-center">Consultar listado de dispositivos</h2></ItemTitle>
                        </ItemContent>
                    </Item>
                </NavLink>
                <NavLink to="list-api-externa">
                    <Item  className="max-w-[200px]" variant="outline">
                        <ItemHeader>
                        <Microscope  size={"100%"} />
                        </ItemHeader>
                        <ItemContent>
                        <ItemTitle><h2 className="text-xl text-center">Consultar api de rick y morty</h2></ItemTitle>
                        </ItemContent>
                    </Item>
                </NavLink>
            </ItemGroup>
            </div>
  )
}
