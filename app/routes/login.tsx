import { LoginForm } from "../components/login-form"
import type { Route } from "./+types/login";
import { redirect, data } from "react-router";
import noAuthMiddleware from "../middleware/noAuthMiddleware"
import { sessionCookie, commitSession, getSession } from "../lib/sessionManager.server"
import DownShaper from "../components/ui/shaper/DownShaper"
import UpShaper from "../components/ui/shaper/UpShaper"


export async function loader({ request }: Route.ActionArgs) {
  return null;
}
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login Jeelidev App" },
    { name: "description", content: "Pagina de logueo" },
  ];
}
export async function action({ request, context }: Route.ActionArgs) {
  const error = { message: "" };
  let formData = await request.formData();
  if (!formData.get("email") || !formData.get("password")) {
    error.message = "Faltan parametros, ingrese el correo y el password"
  } else {
    const rawResponse = await fetch("https://api.qa.myintelli.net/v1/login",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") })
      })
    const content = await rawResponse.json()
    if (content?.error) {
      error.message = "Error inesperado"
    }
    if (!content?.token) {
      error.message = "Error, no se pudo obtener una session valida"
    }
    if (content?.error == 'Unauthorized') {
      error.message = "Crecendiales Invalidas"
    }
    if (error.message) {
      return data({ error }, { status: 400 });
    }
    const SessionObject = await getSession(request.headers.get("Cookie"))
    if (!SessionObject.get("statusSession") && !SessionObject.get("id")) {
      let date = new Date();
      date.setMinutes(date.getMinutes() + 2);
      SessionObject.set("id", content?.user?.id_user)
      SessionObject.set("token", content?.token)
      SessionObject.set("userData", JSON.stringify({ email: content?.user?.email, fullName: `${content?.user?.first_name} ${content?.user?.last_name}`, modules: content?.modules, setting: content?.user?.settings_user }))
      SessionObject.set("dateLastSession", new Date())
      SessionObject.set("statusSession", true)
      SessionObject.set("finLastSession", date)
      await commitSession(SessionObject)
      return redirect(`/dashboard`, {
        headers: {
          "Set-Cookie": await sessionCookie.serialize(content?.user?.id_user),
        }
      });
    } else {
      return redirect(`/dashboard`);
    }
  }
}

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <DownShaper />
      <div className="w-full max-w-sm z-1">
        <LoginForm />
      </div>
      <UpShaper />
    </div>
  )
}
export const middleware = [noAuthMiddleware];