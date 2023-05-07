<template>
  <div>
    <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
    <el-select v-model="projectId" class="m-2" placeholder="请选择所属项目">
      <el-option
          v-for="(item,index) in projectData"
          :key="index"
          :label="item.name"
          :value="item.id"
      />
    </el-select>
    <el-select v-model="materialId" class="m-2" placeholder="请选择所属资料">
      <el-option
          v-for="(item,index) in materialData"
          :key="index"
          :label="item.name"
          :value="item.id"
      />
    </el-select>
    <el-button @click="search" type="success" style="margin-left: 10px">查询</el-button>
    <el-button @click="reset" type="primary">重置</el-button>
    <el-table :data="schemeData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="方案Id" width="220px"/>
      <el-table-column prop="name" label="方案名称"/>
      <el-table-column prop="projectName" label="方案所属项目"/>
      <el-table-column prop="materialName" label="方案所属资料"/>
      <el-table-column label="方案所属用户">{{userStoreVar.user.userName}}</el-table-column>
      <el-table-column prop="summary" label="方案内容"/>
      <el-table-column fixed="right" label="操作" width="120px">
        <template #default="scope">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
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

import {getCurrentInstance, onMounted, ref} from "vue";
import {get} from "@/request/request";
import {userStore} from "@/store/userStore";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "ProgrammeManage",
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const pageSize=10
    const navSize=5
    let currentPage=ref(1)
    const userStoreVar=userStore()
    const schemeData=ref(0)
    const projectId=ref('')
    const materialId=ref('')
    const projectData=ref()
    const materialData=ref()
    let searchValue=ref("")
    const primarySearch=async () => {
      const {data} = await get(httpUrl + "/scheme/getPaged", {
        pageSize:pageSize,
        pageNum:currentPage.value,
        navSize:navSize,
      });
      schemeData.value = data;
    }
    onMounted(async () => {
      await primarySearch()
      {
        const {data} = await get(httpUrl + "/project/getAll", {})
        projectData.value = data
      }
      {
        const {data} = await get(httpUrl + "/material/get", {})
        materialData.value = data
      }
    })
    const search=async () => {
      const {data} = await get(httpUrl + "/scheme/getPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        schemeName: searchValue.value,
        materialName: searchValue.value,
        projectName: searchValue.value,
        materialId:materialId,
        projectId:projectId
      });
      schemeData.value = data;
    }
    const reset=()=>{
      searchValue.value=""
      primarySearch()
    }
    const handleDelete=(row)=>{
      ElMessageBox.confirm(
          '您确定要删除该方案吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl+"/scheme/delete", {id:row.id})
        if (code === 200) {
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '删除失败',
            type: 'error',
          })
        }
        await primarySearch()
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
    }
    return{
      pageSize,
      navSize,
      currentPage,
      userStoreVar,
      schemeData,
      search,
      projectId,
      materialId,
      projectData,
      materialData,
      searchValue,
      reset,
      handleDelete
    }
  }
}
</script>

<style scoped>

</style>
