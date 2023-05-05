import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import "@/assets/common.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia";
import router from "@/router/router";
import piniaPluginPersist from 'pinia-plugin-persist'
import * as echarts from "echarts";
const app = createApp(App)
app.config.globalProperties.$echarts = echarts
//添加路由
app.use(router)
//添加elementUI组件
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//添加pinia数据仓库
const pinia = createPinia()
pinia.use(piniaPluginPersist)
app.use(pinia)
app.mount('#app')
//忽略报错
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}
