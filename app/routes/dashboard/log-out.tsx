import type { Route } from "../+types/login";
import { redirect} from "react-router";
//import authMiddleware from "../../middleware/noAuthMiddleware"
import {  getSession, destroySession, sessionCookie } from "../../lib/sessionManager.server"


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Log out Jeelidev App" },
    { name: "description", content: "Pagina de deslogueo" },
  ];
}


export async function loader({ request }: Route.ActionArgs) {
  const SessionObject = await getSession(request.headers.get("Cookie"))
          let ExpierDate = new Date();
  ExpierDate.setFullYear(ExpierDate.getFullYear() - 30);
  if (SessionObject.get("statusSession") && SessionObject.get("id")) { 
    SessionObject.set("statusSession", false)
    SessionObject.set("finLastSession", new Date())
    destroySession(SessionObject)
    return redirect("/", {
            headers: {
              "Set-Cookie": await sessionCookie.serialize("exit", {expires:ExpierDate, maxAge:0}),
            }
          });
  } else {
    return redirect("/",{
            headers: {
              "Set-Cookie": await sessionCookie.serialize("exit", {expires:ExpierDate, maxAge:0}),
            }
          });
  }
}

export default function Login() {
  return (
    <h1>Exit</h1>
  )
}
//export const middleware = [authMiddleware];