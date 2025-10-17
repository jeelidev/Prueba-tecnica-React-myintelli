//import type { ActionFunctionArgs, MiddlewareFunction } from "react-router"
import { redirect , type ActionFunctionArgs, type MiddlewareFunction} from "react-router"
import {  getSession } from "~/lib/sessionManager.server"

export default async function noAuthMiddleware({
  request,
  context
}: ActionFunctionArgs, next: () => Promise<Response>) {
  const Cookies = request.headers.get("Cookie")
  if (Cookies) {
    const session = await getSession(request.headers.get("Cookie"));

    //console.log(session.data)
    //console.log(session.get("finLastSession") > new Date() )

    if (session.get("id") && session.get("statusSession") && session.get("finLastSession") > new Date() ) {
      throw redirect("/dashboard");
    } 
    //context.set(userContext, session.data as UserSession);

    //const user = await getUserById(userId);
    //context.set(userContext, user);
  }
  let response = await next();
  return response
}