import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Verify from "@/pages/Verify";
import { generateRoutes } from "@/utils/generateRoutes";
import { createBrowserRouter } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import { withAuth } from "@/utils/withAuth";

const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                path: '/about',
                Component: About
            }
        ]
    },
    {
        path: '/admin',
        Component: withAuth(DashboardLayout, "SUPER_ADMIN"),
        children: generateRoutes(adminSidebarItems)
        // children: [...generateRoutes(adminSidebarItems)]
    },
    {
        path: '/user',
        Component: withAuth(DashboardLayout, "USER"),
        children: generateRoutes(userSidebarItems)
    },
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/register',
        Component: Register
    },
    {
        path: '/verify',
        Component: Verify
    },
    {
        path: '/unauthorized',
        Component: Unauthorized
    },
]);

export default router