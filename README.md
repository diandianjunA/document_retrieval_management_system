# 文档检索管理系统

## 系统概述
本系统是一个基于云端的文档资料统一管理平台，实现文档的集中管
理和知识元的统一归档。在该系统中，用户可以方便地上传、下载和共享历史案
例资料，包括各种技术文档、相关规范等。系统支持帮助用户快速查找和检索所
需的信息。此外，系统还支持对于知识元的管理，知识元和技术方案唯一绑定。
该系统还拥有技术方案自动生成的功能。通过算法分析，系统能够在新建工程项
目时，通过和历史案例资料的相似度对比，自动生成技术方案。

## 系统模块
- 用户登录模块

## 初始化操作
main.js
```javascript
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
```
router.js
```javascript
import { createRouter, createWebHashHistory } from "vue-router";
import index from "@/components/index";
import Login from "@/components/Login";
const routes = [
    
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
```

## 用户登录模块
### 创建userStore用于存储用户信息
```javascript
import {defineStore} from 'pinia'
import {reactive} from "vue";

export const userStore=defineStore("userStore",{
    state: ()=>{
        return {
            user: reactive({})
        };
    },
    // 开启数据缓存 若 需要state 中的变量页面刷新数据缓存 需要调用 actions 中的方法
    actions:{
        construct(user){
            this.user=user
        }
    },
    persist: {
        enabled: true, // 开启数据缓存
    }
})
```

### 用户登录界面创建

Login.vue
```javascript
<template>
  <div class="login">
    <div class="box">
      <h2 style="margin: 80px auto;color: aquamarine">登录</h2>
      <el-form :model="form" label-width="120px" class="pos" ref="formEl" :rules="rules">
        <el-form-item label="账号" class="item">
          <el-input v-model="form.account" />
        </el-form-item>
        <el-form-item label="密码" class="item">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" style="position: absolute;top: 62%;left: 45%" @click="submit(formEl)">登录</el-button>
    </div>
  </div>
</template>

<script>
import {onBeforeUnmount, reactive, ref} from "vue";
import {post} from "@/request/request";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {userStore} from "@/store/userStore";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  setup(){
    const httpUrl="http://localhost:8080/"
    document.querySelector('body').setAttribute('style','background-color: rgb(25,75,129)')
    onBeforeUnmount(()=>{
      document.querySelector('body').removeAttribute('style')
    })
    const form=reactive({
      account:'',
      password:''
    })
    const router = useRouter();
    const formEl=ref('')
    const rules=reactive({
      account: { required: true, message: '请输入账号', trigger: 'blur'},
      password: { required: true, message: '请输入密码', trigger: 'blur'}
    })
    let useStore=userStore()
    let submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const {data, msg} = await post(httpUrl + "/user/login", form)
          if (data === null) {
            ElMessage({
              message: msg,
              type: 'error',
            })
          } else {
            useStore.construct(data)
            ElMessage({
              message: '登陆成功',
              type: 'success',
            })
            await router.push({path: "/index"})
          }
        } else {
          ElMessage({
            message: "请填写字段",
            type: 'error',
          })
          return false
        }
      })
    };
    return{
      form,
      submit,
      formEl,
      rules
    }
  }
}
</script>

<style>
  .box{
    margin: 200px auto;
    width: 600px;
    height: 400px;
    background-color: rgb(130,77,81);
    display: flex;
    position: relative;
  }
  .pos{
    position: absolute;
    top: 35%;
    left: 17%;
  }
  .item .el-form-item__label{
    color: aliceblue;
  }
</style>
```
### 路由注册
```javascript
    const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    }
];
```
