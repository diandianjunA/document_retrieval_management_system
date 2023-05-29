<template>
  <div>
    <div style="text-align: center;font-family: Bahnschrift,serif;margin-top: 8%;color: #606266;font-weight: bold">请选择生成方案的项目</div>
    <el-menu class="el-menu-vertical-demo"  style="width: 350px;height: 400px;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto;font-family: Bahnschrift,serif;border: #666666;overflow-y: scroll">
      <el-menu-item v-for="(item,index) in projectData" :key="index" @click="jump(item)">
        <span>{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {documentStore} from "@/store/documentStore";
import router from "@/router/router";
import {getCurrentInstance, onMounted, ref} from "vue";
import {get} from "@/request/request";
import {projectStore} from "@/store/projectStore";

export default {
  name: "ProjectChoice",
  setup(){
    const documentStoreVar=documentStore()
    const projectStoreVar=projectStore()
    const projectData=ref()
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    onMounted(async () => {
      await primarySearch()
    })
    const primarySearch=async () => {
      {
        const {data} = await get(httpUrl + "/project/getAll", {});
        projectData.value = data;
      }
    }
    const goToNewScheme=async () => {
      await router.push({path: "/index/NewScheme"})
    }
    const jump=async (item) => {
      projectStoreVar.project.id = item.id
      projectStoreVar.project.name = item.name
      projectStoreVar.project.remark = item.remark
      projectStoreVar.project.category = item.category
      projectStoreVar.project.userId = item.userId
      await router.push({path: "/index/NewScheme"})
    }
    return {
      documentStoreVar,
      goToNewScheme,
      projectData,
      jump
    }
  }
}
</script>

<style scoped>

</style>
