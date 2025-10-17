import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '~/components/ui/card'
import { Toaster } from "~/components/ui/sonner" 
import type { Route } from "./+types/root";
import "./app.css";
import {UseReduxProvider} from './context/useMyRedux'

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UseReduxProvider>
        {children}
        </UseReduxProvider>
        <Toaster/>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocurrio un error desconocido";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "Recurso no encontrado."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 w-full p-4 min-h-svh bg-background flex-1 content-center">
      <Card className="max-w-xs mx-auto">
        <CardHeader>
          <CardTitle>{message}</CardTitle>
          <CardDescription>
            {details}
          </CardDescription>
        </CardHeader>
         {stack && (<CardContent>
           <pre className="w-full text-primary max-w-sm p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
        </CardContent>)}
        </Card>
    </main>
  );
}
