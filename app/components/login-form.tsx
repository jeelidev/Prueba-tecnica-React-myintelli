import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import logo from "./images/Logo-prueba.png"
import { useFetcher } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const loginFetcher = useFetcher()
  let error = loginFetcher.data?.error;
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="max-w-[200px] mr-auto ml-auto">
        <img src={logo} alt="logo" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inicia sesion con tus credenciales</CardTitle>
          <CardDescription>
            Ingresa el usuario y el passwor que te fue provisto por myintelli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <loginFetcher.Form method="post">
            {error?.message && (
              <Alert variant="destructive" className="mb-5">
                  <AlertCircleIcon />
                  <AlertTitle>ERROR</AlertTitle>
                  <AlertDescription>
                    {error?.message}
                  </AlertDescription>
              </Alert>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" >Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Olvido la contraseña?
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  no esta registrado? <a href="#">Registrarse</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </loginFetcher.Form>
        </CardContent>
      </Card>
    </div>
  )
}
