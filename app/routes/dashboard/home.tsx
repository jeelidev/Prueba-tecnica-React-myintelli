import type { Route } from "./+types/home";
import {
    Item,
    ItemContent,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from "~/components/ui/item"
import SetTitleBread from "~/components/triggersClient/setTitleBread"
import { MonitorSmartphone, Microscope } from "lucide-react"
import { NavLink } from "react-router"
import DownShaper from "../../components/ui/shaper/DownShaper"

export async function loader({ request, context }: Route.ActionArgs) {
    return null
}

export default function Home() {


    return (
        <div className="h-full pt-5">
            <div className="flex justify-center">
                <SetTitleBread title="Bienvenido" />
                <ItemGroup className="flex flex-row gap-4">
                    <NavLink className="flex flex-col" to="list-devices">
                        <Item className="max-w-[200px] flex-1 bg-input" variant="outline">
                            <ItemHeader >
                                <MonitorSmartphone fill="#7166E4" stroke="#2385F4" size={"100%"} />
                            </ItemHeader>
                            <ItemContent>
                                <ItemTitle><h2 className="text-xl text-primary text-center">Consultar listado de dispositivos</h2></ItemTitle>
                            </ItemContent>
                        </Item>
                    </NavLink>
                    <NavLink className="flex flex-col" to="list-api-externa">
                        <Item className="max-w-[200px] bg-accent  flex-1" variant="outline">
                            <ItemHeader>
                                <Microscope fill="#2385F4" stroke="#7166E4" size={"100%"} />
                            </ItemHeader>
                            <ItemContent>
                                <ItemTitle><h2 className="text-xl text-secondary-foreground text-center">Consultar api de rick y morty</h2></ItemTitle>
                            </ItemContent>
                        </Item>
                    </NavLink>
                </ItemGroup>
            </div>
            <DownShaper />
        </div>

    )
}
