import {defineStore} from "pinia";
import {reactive} from "vue";

export const schemeStore=defineStore("schemeStore",{
    state: ()=>{
        return {
            project: reactive()
        };
    },
    // 开启数据缓存 若 需要state 中的变量页面刷新数据缓存 需要调用 actions 中的方法
    actions:{
        construct(schemes){
            this.project=schemes
        }
    },
    persist: {
        enabled: true, // 开启数据缓存
    }
})
