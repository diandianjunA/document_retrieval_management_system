import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import "@/assets/common.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia";
import router from "@/router/router";
import piniaPluginPersist from 'pinia-plugin-persist'

const app = createApp(App)
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
