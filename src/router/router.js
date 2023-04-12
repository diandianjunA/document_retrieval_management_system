import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
import Main from "@/components/Index/Main";
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
        component: index,
        children:[
            {
                path: "main",
                component: Main
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
