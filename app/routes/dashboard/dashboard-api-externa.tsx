import type { Route} from "./+types/dashboard-api-externa";
import Button from "../../components/buttom"
import SetTitleBread from "~/components/triggersClient/setTitleBread"

export async function loader({ request, context }: Route.ActionArgs) {
  return null
}

export default function ApiExterna() {


    return (
        <div>
             <SetTitleBread title="Api Externas"/>
            <h1>Estoy en ApiExterna</h1>
            <Button>bottom ApiExterna</Button>
      </div>
  )
}

