import { redirect, type ActionFunctionArgs } from "react-router";
import { getSession, destroySession, commitSession } from "~/lib/sessionManager.server";

export default async function authMiddleware({
  request,
  context,
}: ActionFunctionArgs, next: () => Promise<Response>) {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {

    throw redirect("/");
  }

  const session = await getSession(cookieHeader);


  const finLastSession = session.get("finLastSession")
    ? new Date(session.get("finLastSession"))
    : null;

  if (
    !session.get("id") ||
    !session.get("statusSession") ||
    !finLastSession ||
    finLastSession < new Date()
  ) {

    throw redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }


  let newExpiryDate = new Date();
  newExpiryDate.setMinutes(newExpiryDate.getMinutes() + 2);


  session.set("finLastSession", newExpiryDate);

  const response = await next();

  response.headers.append("Set-Cookie", await commitSession(session));

  return response;
}