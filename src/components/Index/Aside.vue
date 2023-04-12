<template>
  <div class="Aside">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="sidebarStoreVar.collapse"
        style="border: none"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><UserFilled /></el-icon>
        <template #title>案例库管理</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><SuitcaseLine /></el-icon>
        <template #title>文档查询</template>
      </el-menu-item>
      <el-menu-item index="5">
        <el-icon><Monitor /></el-icon>
        <template #title>新方案管理</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {sidebarStore} from "@/store/sidebarStore";
import {userStore} from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Aside",
  components:{

  },
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let sidebarStoreVar=sidebarStore()
    let useStore=userStore()
    return{
      sidebarStoreVar,
      useStore,
    }
  }
}
</script>

<style scoped>
.Aside{
  height: 100%;
  margin: 0;
  padding: 0;
}
.AsideCollapse{
  width: 50px;
}
</style>
