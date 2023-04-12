import {defineStore} from 'pinia'

export const sidebarStore=defineStore("sidebar",{
    state: ()=>{
        return {
            collapse: false
        };
    },
    actions:{
        change(){
            this.collapse=!this.collapse
        }
    }
})
