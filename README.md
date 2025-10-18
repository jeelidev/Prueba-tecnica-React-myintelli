# Proyecto de react router 7 en modo frameswork para prueba tecnica, realizado por Jese Brito ! ' !'

[![Ver proyecto en produccion]](https://prueba-tecnica-react-myintelli.jeelidev.uk/))

## QUE HICE ' !'

- 🚀 Se uso renderizado del lado del servidor, para las cosas sensibles de seguridad como el respalde de manejo de sesiones de usuario al hacer login

- ⚡️  El token se almacena en una tabla de sesiones de sqlite, que permite mantener el token una vez obtenido desde el servicio de myintelli. siempre del lado del servidor, y desde ahí se envia para obtener toda la información sensible de la api de devices posteriormente

- ⚡️ Posee un middleware de Authenticacion que ordena redirecciones del lado del servidor al no encontrar sesiones activas en la base de datos o cookies de session en el cliente manteniendo las rutas del dashboard solo accesibles con una sesion activa, además monitorea constantemente el estado para sacarte de session si vence tu cookie o se vence tu tiempo se session en base de datos

- 📦 Se implemento la logica de uso de contexto del lado del cliente también, a pesar de estar usando el react router en su versión 7 en modo frameswork con la mayor parte de las consultas del lado del servidor, se realizó un contexto Redux Casero con el context de react, capas cambiar los títulos de las secciones de consultas de cada api (todo desde el navegador sin depender de fech al servidor)

- 🔄 Se realizo todo lo solicitado en la prueba técnica, consultar api de devices, filtrar la lista, cargadores en toda session o solicitud que necesitará ser asincrónica, y flujos de actualización y revalidación de session

- 🔒 SE USO TAILWIND Y UNA LIBRERIA DE COMPONENTES LLAMADA shadcn PERO NO SE COPIO Y PEGO NADA MÁS, se modifico y adapto cada componente y estilo, desde el color, hasta los espaciados y efectos, para obtener una experiencia acorde a las necesidades del proyecto
  
- 🎉 Tiene un manejo y soporte de migración de schemas de db con drizzle para poder dar soporte a las sesiones del usuario del lado el servidor
  
- 📖 MIL GRACIAS SI LEISTE TODO ESTO

## CÓMO PROBAR EL PROYECTO

### Installation

PRIMERO que nada en cualquiera de los dos casos de ejecución a continuacion, vas a necesitar tener en tu carpeta local tu propia versión de .env, creada a partir del .env.example de este proyecto

Le he creado un docker personalizado para despliegue en modo de producción, para mi coolify, si tiene instalado docker simplemente ejecuta en consola

```bash
docker compose up --build
```

y listo todo sera MAGIA, o en su defecto el homólogo de este comando en windows o mac, desde la carpeta raíz del proyecto

SI NO TIENES DOCKER, O LO ODIAS A MUERTE POR QUE ESAS SON COSAS DE DEVOPS Y TU NO ERES DEVOPS

te tengo un clasico

Instala dependencias

```bash
npm install
```

Compila el proyecto

```bash
npm run build
```

Ejecuta en modo de produccion y entra por localhost:3000 (o lo que sea que colocaste en tu .env)

```bash
npm run start
```

Y listo, creo que no hay mucho más que explicar lo demas (por donde navegar que ver, etc, es tal cual lo que se pidió en la prueba técnica, osea el pdf))

GRACIAS  ❤️
