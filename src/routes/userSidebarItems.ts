import Bookings from "@/pages/User/Bookings";
import type { ISidebar } from "@/types";

export const userSidebarItems: ISidebar[] = [
    {
        title: "Dashboard",
        items: [
            {
                title: "Bookings",
                url: "/user/bookings",
                component: Bookings
            },
        ],
    }
]