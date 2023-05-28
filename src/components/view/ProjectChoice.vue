<template>
  <div>
    <el-table
        :data="projectData" row-key="id" ref="projectTableRef"
        style="width: 300px;height: 500px;position: absolute;left: 0;right: 0;top: 0;bottom: 0;margin: auto" border @selection-change="projectSelection">
      <el-table-column
          prop="name"
          label="请选择生成方案的项目"
          width="251px">
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true"/>
    </el-table>
  </div>
</template>

<script>
import {documentStore} from "@/store/documentStore";
import router from "@/router/router";
import {getCurrentInstance, onMounted, ref} from "vue";
import {get} from "@/request/request";

export default {
  name: "ProjectChoice",
  setup(){
    const documentStoreVar=documentStore()
    const projectData=ref()
    const projectIds=ref([])
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
    const projectSelection = (val)=>{
      projectIds.value = []
      // 假设取出 id 字段
      val.forEach(item => {
        const id = item.id
        // 判断数组中是否包含这个 id
        if (projectIds.value.indexOf(id) === -1) {
          projectIds.value.push(id)
        }
      })
    }
    return {
      documentStoreVar,
      goToNewScheme,
      projectData,
      projectSelection
    }
  }
}
</script>

<style scoped>

</style>
