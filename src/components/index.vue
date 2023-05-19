<template>
  <div class="layout">
    <el-container ref="box">
      <el-container>
        <el-header style="padding: 0">
          <Header></Header>
        </el-header>
        <el-main style="padding: 0;overflow: hidden">
          <router-view v-if="isRouterAlive"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "@/components/component/Header";
import {sidebarStore} from "@/store/sidebarStore";
import {nextTick, onMounted, provide, reactive, ref} from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "index",
  components: {Header},
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let sidebarStoreVar=sidebarStore()
    let box = ref(null);
    let style=reactive({})
    const isRouterAlive= ref(true);
    const reload=()=>{
      isRouterAlive.value=false;
      nextTick(()=>{
        isRouterAlive.value=true;
      })
    }
    provide('reload',reload)
    onMounted(async () => {
      style = {
        height: box.value
      }
    });
    return{
      sidebarStoreVar,
      style,
      isRouterAlive
    }
  }
}
</script>

<style scoped>
.layout{
  height: 100%;
  margin: 0;
  padding: 0;
}
.aside{
  width: 200px;
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.asideCollapse{
  width: 65px;
}
</style>

