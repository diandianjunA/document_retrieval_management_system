import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
import AddCase from "@/components/case/AddCase";
import ModifyCase from "@/components/old/ModifyCase";
import UploadMaterial from "@/components/old/UploadMaterial";
import DocumentPreview from "@/components/case/DocumentPreview";
import FuzzySearch from "@/components/old/FuzzySearch";
import SelectionResults from "@/components/old/SelectionResults";
import ProgrammeManage from "@/components/old/ProgrammeManage";
import SelectGenerateProg from "@/components/old/SelectGenerateProg";
import SchemeTable from "@/components/old/SchemeTable";
import SimilarityAnalyze from "@/components/old/SimilarityAnalyze";
import ProjectManagement from "@/components/case/ProjectManagement";
import SearchView from "@/components/case/SearchView";
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
            },
            {
                path: "ProjectManagement",
                component: ProjectManagement
            },
            {
                path: "SearchView",
                component: SearchView
            },
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
