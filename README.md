# Proyecto de react router 7 en modo frameswork para prueba tecnica, realizado por Jese Brito ' !'

A modern, production-ready template for building full-stack React applications using React Router.

[![Ver proyecto en produccion]](https://prueba-tecnica-react-myintelli.jeelidev.uk/))

## QUE HICE ' !'

- 🚀 Se uso renderizado del lado del servidor, para las cosas sensibles de seguridad como el respalde de manejode se sesiones de usuario al hacer login
- ⚡️ El token se almacena en una tabla de sessiones de sqlite, que permite mantener el token una ves obtenido desde el servicio de myintelli. siempre del lado del servidor, y desde ahi se envia para obtener toda la informacion sensible de la api de devices posteriormente
- ⚡️ Posee un middleware de Authenticacion que ordena redireccioes del lado del servidor al no encontrar sessiones activas en la base de datos o cookies de session en el cliente manteniendo las rutas del dasboards solo accecibles con una sesion activa, ademas monitorea constante mente el estado para sacarte del session se vence tu cookie o se se vence tu tiempo se session en base de datos
- 📦 Se implemento la logica de uso de contexto del lado del cliente tambien, a pesar de estar usando el react router en su version 7 en modo frameswork la mayor parte de las consultas del lado del servidor, se realizo un contexto Redux Casero con el contex de react, capas cambiar los titulos de las secciones de consultas de cada api (todo desde el navegador sin depenser de fech al servidor)
- 🔄 Se realizo todo lo solicitado en la prueba tecnica, consultar api de devices, filtar la lista, cargadores en toda session o solicitud que necesitara ansincronica, y flujos de actualizacion y revalidacion de session
- 🔒 SE USO TAILWIND Y UNA LIBRERIA DE COMPONENTES LLAMADA shadcn  PERO NO SE COPIO Y PEGO NADA MAS, se modifico y adapto cada componente y estilo, desde el color, hasta los espaciados y efectos, para obtener una experienci acorde a las necesidades del proyecto
- 🎉 Tiene un manejo y soporte de migracion de schemas de db con drizzle paro poder dar soporte a las sesiones del usuario del lado el servidor
- 📖 MIL GRACIAS SI LEISTE TODO ESTO

## COMO PROBAR EL PROYECTO

### Installation

PRIMERO que nada en cualquiera de los dos casos de ejecucion a continuacion, vas a necesitar tener en tu carpeta local tu propia version de .env, creada a partir del .env.example de este proyecto

Le he creado un docker personalizado para despliegue en modo de produccion, para mi coolify, si tiene instalado docker instalado simplemente ejecuta en consola

```bash
docker compose up --build
```

y listo todo sera MAGIA, o en si defecto el homologo de este comando en windows o mac, desde la carpeta raiz del proyecto

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

Ejecuta en modo de produccion y entra por localhost:3000 (o lo que sea que colocaste en tu .even)

```bash
npm run start
```

Y listo, creo que no hay mucho mas que explicar lo demas (por donde navegar que ver, etc, es tal cual loque se pidio en la prueba tecnica, osea el pdf)

GRACIAS  ❤️
