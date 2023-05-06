<template>
  <div>
    <el-table :data="schemeData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="方案Id" width="220px"/>
      <el-table-column prop="name" label="方案名称"/>
      <el-table-column prop="projectName" label="方案所属项目"/>
      <el-table-column prop="materialName" label="方案所属资料"/>
      <el-table-column label="方案所属用户">{{userStoreVar.user.userName}}</el-table-column>
      <el-table-column prop="summary" label="方案内容"/>
    </el-table>
    <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="schemeData.total"
        :pager-count="navSize"
        class="mt-4"
        v-model:current-page="currentPage"
        @current-change="search"
        style="margin-top: 10px;justify-content: center;"
    />
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {userStore} from "@/store/userStore";
import {schemeStore} from "@/store/schemeStore";
import {get} from "@/request/request";

export default {
  name: "SchemeTable",
  setup(){
    const httpUrl="http://localhost:8070"
    const pageSize=10
    const navSize=5
    let currentPage=ref(1)
    const userStoreVar=userStore()
    const schemeStoreVar=schemeStore()
    const schemeData=ref(0)
    onMounted(async () => {
      const {data} = await get(httpUrl + "/scheme/getPaged", {
        pageSize:pageSize,
        pageNum:currentPage.value,
        navSize:navSize,
        projectId:schemeStoreVar.project.id
      });
      schemeData.value = data;
    })
    const search=async () => {
      const {data} = await get(httpUrl + "/scheme/getPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        projectId: schemeStoreVar.project.id
      });
      schemeData.value = data;
    }
    return{
      pageSize,
      navSize,
      currentPage,
      userStoreVar,
      schemeStoreVar,
      schemeData,
      search
    }
  }
}
</script>

<style scoped>

</style>
