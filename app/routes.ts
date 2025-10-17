import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/login.tsx"),  
    route("dashboard", "routes/dashboard/dashboard.tsx", [
    // renders into the dashboard.tsx Outlet at /dashboard
    index("routes/dashboard/home.tsx"),
    route("list-devices", "routes/dashboard/dashboard-devices.tsx"),
    route("list-api-externa", "routes/dashboard/dashboard-api-externa.tsx"),
    route("log-out","routes/dashboard/log-out.tsx")
    
  ]),
] satisfies RouteConfig;
