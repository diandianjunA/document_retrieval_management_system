import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/index",
        component: index
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
