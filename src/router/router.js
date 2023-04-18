import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
import AddCase from "@/components/case/AddCase";
import ModifyCase from "@/components/case/ModifyCase";
import UploadMaterial from "@/components/case/UploadMaterial";
import DocumentPreview from "@/components/case/DocumentPreview";
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
                path: "addCase",
                component: AddCase
            },
            {
                path: "modifyCase",
                component: ModifyCase
            },
            {
                path: "uploadMaterial",
                component: UploadMaterial
            },
            {
                path: "documentPreview",
                component: DocumentPreview
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
