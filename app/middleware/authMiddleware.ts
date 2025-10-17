import { redirect , type ActionFunctionArgs} from "react-router"
import {  getSession, destroySession,commitSession } from "~/lib/sessionManager.server"

export default async function authMiddleware({
  request,
  context
}: ActionFunctionArgs, next: () => Promise<Response>) {
  const Cookies = request.headers.get("Cookie")

  if (Cookies) {
    const session = await getSession(request.headers.get("Cookie"));

    if (!session.get("id") || !session.get("statusSession") || session.get("finLastSession") < new Date()) {
      destroySession(session)
      throw redirect("/");
    } else {
      let date = new Date();
      date.setMinutes(date.getMinutes() + 2);
      session.set("finLastSession", date)
      commitSession(session)
    }
    //context.set(userContext, session.data as UserSession);

    //const user = await getUserById(userId);
    //context.set(userContext, user);
  } else {
    //throw redirect("/");
  }
  let response = await next();
  return response
};