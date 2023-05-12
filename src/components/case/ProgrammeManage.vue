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
    <el-dialog v-model="dialogTableVisible" title="方案内容填写" width="550px">
      <el-form :model="form" style="margin-left: 50px" ref="ruleFormRef" :rules="rules" v-loading="loading"
               element-loading-text="Loading..."
               :element-loading-svg="svg"
               class="custom-loading-svg"
               element-loading-svg-view-box="-10, -10, 50, 50">
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
            <textarea maxlength="200" onchange="this.value=this.value.substring(0, 200)" οnkeydοwn="this.value=this.value.substring(0, 200)"
                      onkeyup="this.value=this.value.substring(0, 200)" v-model="form.summary" style="width: 380px;height: 100px;font-size: 15px;resize: none;padding: 10px"></textarea>
        </el-form-item>
        <el-input-number v-model="length" :min="12" :max="255" style="margin-left: 150px"/>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button @click="generate">自动生成方案内容</el-button>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="submit(ruleFormRef)">
              确认
            </el-button>
          </span>
      </template>
    </el-dialog>
    <el-table :data="schemeData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="方案Id" width="220px"/>
      <el-table-column prop="name" label="方案名称"/>
      <el-table-column prop="projectName" label="方案所属项目"/>
      <el-table-column prop="materialName" label="方案所属资料"/>
      <el-table-column label="方案所属用户">{{userStoreVar.user.userName}}</el-table-column>
      <el-table-column prop="summary" label="方案内容"/>
      <el-table-column fixed="right" label="操作" width="120px">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {get, post} from "@/request/request";
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
    const dialogTableVisible = ref(false)
    const ruleFormRef = ref('')
    const formLabelWidth='140px'
    const form = reactive({
      id:'',
      name: '',
      projectId: '',
      materialId:'',
      summary: '',
    })
    const length=ref(15)
    const loading = ref(false)
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
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
        materialId:materialId.value,
        projectId:projectId.value
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
    const handleEdit=async (row)=>{
      form.id=row.id
      form.projectId=row.projectId
      form.materialId=row.materialId
      form.name=row.name
      form.summary=row.summary
      dialogTableVisible.value=true
    }
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const {code} = await post(httpUrl+"/scheme/update", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
            dialogTableVisible.value = false
            await primarySearch()
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
      }else if(length.value===null||length.value===''){
        ElMessage({
          message: '请选择生成资料的长度',
          type: 'error',
        })
      } else {
        loading.value=true
        const {code,data} = await get(httpUrl + "/scheme/generate", {
          materialId:form.materialId,
          length:length.value
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
        loading.value=false
      }
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
      handleDelete,
      dialogTableVisible,
      form,
      rules,
      submit,
      length,
      loading,
      svg,
      formLabelWidth,
      ruleFormRef,
      generate,
      handleEdit
    }
  }
}
</script>

<style scoped>

</style>
