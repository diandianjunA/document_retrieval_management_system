<template>
    <div class="SelectionResults">
      <div>
        <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
        <el-button @click="search" type="success">查询</el-button>
        <el-dialog v-model="dialogFormVisible" title="选型结果" width="500px" >
        </el-dialog>
      </div>
      <el-table :data="projectData.list" style="width: 100%" border="border">
        <el-table-column fixed prop="id" label="Id" width="50px"/>
        <el-table-column prop="name" label="名称" width="100px"/>
        <el-table-column prop="category" label="类型" width="100px"/>
        <el-table-column prop="remark" label="简介">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default>
            <el-button type="primary" text @click="dialogTableVisible=true">查看选型结果</el-button>
            <el-dialog v-model="dialogTableVisible" title="result">
              <el-table :data="gridData">
                <el-table-column property="date" label="Date" width="150" />
                <el-table-column property="name" label="Name" width="200" />
                <el-table-column property="content" label="Content" />
             </el-table>
            </el-dialog>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="projectData.total"
          :pager-count="navSize"
          class="mt-4"
          v-model:current-page="currentPage"
          @current-change="search"
          style="margin-top: 10px;justify-content: center;"
      />
    </div>
  </template>
  
  <script>
  
  import {onMounted, reactive, ref} from "vue";
  import {get} from "@/request/request";

  export default {
    name: "ModifyCase",
    setup(){
      const httpUrl='http://www.diandianjun.com.cn:8070'
      const pageSize=20
      const navSize=5
      let currentPage=ref(1)
      let searchValue=ref("")
      const projectData=ref(0)
      const dialogFormVisible=ref(false)
      const ruleFormRef = ref('')
      const formLabelWidth='140px'
      const dialogTableVisible = ref(false)
      const form = reactive({
        id:'',
        name: '',
        category: '',
        remark: '',
      })
      onMounted(async () => {
        await primarySearch()
      })
      const search=async () => {
        const {data} = await get(httpUrl+"/project/getPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          navSize: navSize,
          projectName: searchValue.value,
          category: searchValue.value,
          remark: searchValue.value
        })
        projectData.value = data
      }
      const primarySearch=async () => {
        const {data} = await get(httpUrl+"/project/getPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          navSize: navSize,
        })
        projectData.value = data
      }
      const gridData = [
  {
    date: '',
    name: '',
    content: '',
  },
  {
    date: '',
    name: '',
    content: '',
  },
  {
    date: '',
    name: '',
    content: '',
  },
  {
    date: '',
    name: '',
    content: '',
  },
]
      return{
        searchValue,
        search,
        currentPage,
        dialogFormVisible,
        ruleFormRef,
        formLabelWidth,
        form,
        projectData,
        pageSize,
        navSize,
        dialogTableVisible,
        gridData
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  