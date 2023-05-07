import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
import AddCase from "@/components/case/AddCase";
import ModifyCase from "@/components/case/ModifyCase";
import UploadMaterial from "@/components/case/UploadMaterial";
import DocumentPreview from "@/components/case/DocumentPreview";
import FuzzySearch from "@/components/case/FuzzySearch";
import SelectionResults from "@/components/case/SelectionResults";
import ProgrammeManage from "@/components/case/ProgrammeManage";
import SelectGenerateProg from "@/components/case/SelectGenerateProg";
import SchemeTable from "@/components/case/SchemeTable";
import SimilarityAnalyze from "@/components/case/SimilarityAnalyze";
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
            },
            {
                path: "selectionResults",
                component: SelectionResults
            },
            {
                path: "programmeManage",
                component: ProgrammeManage
            },
            {
                path: "selectGenerateProg",
                component: SelectGenerateProg
            },
            {
                path: "FuzzySearch",
                component: FuzzySearch
            },
            {
                path: "SchemeTable",
                component: SchemeTable
            },
            {
                path: "SimilarityAnalyze",
                component: SimilarityAnalyze
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
