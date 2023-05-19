<template>
  <div class="ModifyCase">
    <div>
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px;" @keydown.enter="search"></el-input>
      <el-button @click="search" type="success">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
      <el-dialog v-model="dialogFormVisible" title="修改项目" width="500px" @closed="resetForm">
        <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="项目Id" :label-width="formLabelWidth">
            <el-input v-model="form.id" disabled/>
          </el-form-item>
          <el-form-item label="项目名称" :label-width="formLabelWidth" prop="account">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="项目类型" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.category"/>
          </el-form-item>
          <el-form-item label="项目简介" :label-width="formLabelWidth" prop="password">
            <textarea v-model="form.remark" style="width: 380px;height: 100px;padding:10px;font-size: 15px;resize: none"></textarea>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submit(ruleFormRef)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-table :data="projectData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="项目Id" width="220px"/>
      <el-table-column prop="name" label="项目名称"/>
      <el-table-column prop="category" label="项目类型"/>
      <el-table-column prop="remark" label="项目简介">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220px">
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

import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {get, post} from "@/request/request";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "ModifyCase",
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const pageSize=5
    const navSize=5
    let currentPage=ref(1)
    let searchValue=ref("")
    const projectData=ref(0)
    const dialogFormVisible=ref(false)
    const ruleFormRef = ref('')
    const formLabelWidth='140px'
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
    const reset=()=>{
      searchValue.value=""
      primarySearch()
    }
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          const {code} = await post(httpUrl+"/project/update", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
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
    const resetForm=()=>{
      form.id=''
      form.name=''
      form.category=''
      form.remark=''
    }
    const rules = reactive({
      name: [{ required: true,message: "请输入项目名称", trigger: 'blur' }],
      category: [{ required: true,message: "请输入项目分类", trigger: 'blur' }],
      remark: [{ required: true,message: "请输入项目备注", trigger: 'blur' }],
    })
    const handleEdit = (row) => {
      dialogFormVisible.value=true
      form.id=row.id
      form.name=row.name
      form.category=row.category
      form.remark=row.remark
    }
    const handleDelete = async (row) => {
      ElMessageBox.confirm(
          '您确定要删除该项目吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl+"/project/delete", {id:row.id})
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
      searchValue,
      search,
      reset,
      currentPage,
      dialogFormVisible,
      ruleFormRef,
      formLabelWidth,
      form,
      submit,
      resetForm,
      rules,
      projectData,
      handleEdit,
      handleDelete,
      pageSize,
      navSize,
    }
  }
}
</script>

<style scoped>

</style>
