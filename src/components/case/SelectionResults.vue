<template>
    <div class="SelectionResults">
      <div>
        <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
        <el-button @click="search" type="success">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </div>
      <el-table :data="projectData.list" style="width: 100%" border="border">
        <el-table-column fixed prop="id" label="Id" width="50px"/>
        <el-table-column prop="name" label="名称" width="100px"/>
        <el-table-column prop="category" label="类型" width="100px"/>
        <el-table-column prop="remark" label="简介">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <el-button type="primary" text @click="view(scope.row)">添加方案</el-button>
            <el-button type="success" text @click="exportScheme(scope.row)">导出方案</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="dialogTableVisible" title="result" width="550px">
        <el-form :model="form" style="margin-left: 50px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="方案名" :label-width="formLabelWidth" prop="name">
            <el-col :span="16">
              <el-input v-model="form.name"/>
            </el-col>
          </el-form-item>
          <el-form-item label="方案所属项目" :label-width="formLabelWidth" prop="projectId">
            <el-select v-model="form.projectId" class="m-2" placeholder="请选择所属项目" disabled>
              <el-option
                  v-for="(item,index) in projectData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="方案所属资料" :label-width="formLabelWidth" prop="materialId">
            <el-select v-model="form.materialId" class="m-2" placeholder="请选择所属资料">
              <el-option
                  v-for="(item,index) in materialData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="方案内容" :label-width="formLabelWidth" prop="summary" style="width: 380px;">
            <textarea v-model="form.summary" style="width: 380px;height: 100px;font-size: 15px;resize: none;padding: 10px"></textarea>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="generate">自动生成方案内容</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submit(ruleFormRef)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
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
  import {ElMessage} from "element-plus";
  import {post} from "@/request/request";
  import axios from "@/request/http";

  export default {
    name: "ModifyCase",
    setup(){
      const httpUrl='http://localhost:8070'
      const pageSize=20
      const navSize=5
      let currentPage=ref(1)
      let searchValue=ref("")
      const projectData=ref(0)
      const materialData=ref(0)
      const ruleFormRef = ref('')
      const formLabelWidth='140px'
      const dialogTableVisible = ref(false)
      const form = reactive({
        id:'',
        name: '',
        projectId: '',
        materialId:'',
        summary: '',
      })
      onMounted(async () => {
        await primarySearch()
      })
      const reset=()=>{
        searchValue.value=""
        primarySearch()
      }
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
      const view=async (row) => {
        form.projectId=row.id
        dialogTableVisible.value = true
        const {data} = await get(httpUrl + "/material/getByProjectId", {
          projectId:row.id
        })
        materialData.value=data
      }
      const submit=async (formEl) => {
        if (!formEl) return
        formEl.validate(async (valid) => {
          if (valid) {
            const {code} = await post(httpUrl+"/scheme/save", form)
            if (code === 200) {
              ElMessage({
                message: '操作成功',
                type: 'success',
              })
              dialogTableVisible.value = false
            } else {
              ElMessage({
                message: '操作失败',
                type: 'error',
              })
            }
          } else {
            ElMessage({
              message: '操作失败',
              type: 'error',
            })
            return false
          }
        })
      }
      const rules = reactive({
        name: [{required: true, message: "请输入名称", trigger: 'blur'}],
        projectId: [{required: true, message: "请选择项目", trigger: 'blur'}],
        materialId: [{required: true, message: "请选择资料", trigger: 'blur'}],
        summary: [{required: true, message: "请输入方案内容", trigger: 'blur'}],
      })
      const generate=async () => {
        if (form.materialId == null || form.materialId === '') {
          ElMessage({
            message: '请选择资料',
            type: 'error',
          })
        } else {
          const {code,data} = await get(httpUrl + "/scheme/generate", {
            materialId:form.materialId
          })
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
            form.summary=data
          } else {
            ElMessage({
              message: '操作失败',
              type: 'error',
            })
          }
        }
      }
      const exportScheme=async (row) => {
        axios({
          url: httpUrl+"/scheme/download",
          method: 'get',
          responseType: 'arraybuffer',
          params:{
            projectId: row.id
          }
        }).then(res => {
          const blob = new Blob([res.data]);
          //创建一个<a></a>标签
          let a = document.createElement("a");
          // 将流文件写入a标签的href属性值
          a.href = URL.createObjectURL(blob);
          //设置文件名
          a.download = row.name+".xlsx";
          // 隐藏a标签
          a.style.display = "none";
          // 将a标签追加到文档对象中
          document.body.appendChild(a);
          // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
          a.click();
          //用完就删除a标签
          a.remove();
        })
      }
      return{
        searchValue,
        search,
        currentPage,
        ruleFormRef,
        formLabelWidth,
        form,
        projectData,
        pageSize,
        navSize,
        dialogTableVisible,
        view,
        materialData,
        rules,
        submit,
        generate,
        reset,
        exportScheme
      }
    }
  }
  </script>

  <style scoped>
  </style>
