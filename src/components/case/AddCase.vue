<template>
  <h1 style="text-align: center;font-size: 40px;margin-top: 20px">新增案例项目</h1>
  <el-form :model="form" :rules="rules" ref="ruleFormRef" style="position:relative;height: 600px">
    <el-form-item label="项目名称" :label-width="formLabelWidth" prop="name" style="width: 380px;margin: 40px auto auto;">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="项目类型" :label-width="formLabelWidth" prop="category" style="width: 380px;margin: 40px auto auto">
      <el-input v-model="form.category"/>
    </el-form-item>
    <el-form-item label="项目备注" :label-width="formLabelWidth" prop="remark" style="width: 380px;margin: 40px auto auto">
      <textarea maxlength="200" onchange="this.value=this.value.substring(0, 200)" οnkeydοwn="this.value=this.value.substring(0, 200)"
                onkeyup="this.value=this.value.substring(0, 200)" v-model="form.remark" style="width: 380px;height: 100px;padding:10px;font-size: 15px;resize: none;border-color: rgb(0,0,0,0.15)"></textarea>
    </el-form-item>
    <el-button type="primary" @click="submit(ruleFormRef)" style="position: absolute;left: 50%;top: 280px;margin-left: -28px;">提交</el-button>
  </el-form>
</template>

<script>
import {getCurrentInstance, reactive, ref} from "vue";
import {userStore} from "@/store/userStore";
import {ElMessage} from "element-plus";
import {post} from "@/request/request";

export default {
  name: "AddCase",
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const check=ref(true)
    const userStoreVar=userStore()
    const ruleFormRef = ref('')
    const form = reactive({
      id:'',
      name: '',
      category: '',
      remark: '',
    })
    const formLabelWidth='80px'
    const rules = reactive({
      name: [{ required: true,message: "请输入项目名称", trigger: 'blur' }],
      category: [{required:true,message: "请输入项目类型", trigger: 'blur' }],
      remark: [{ required: true,message: "请输入项目备注", trigger: 'blur' }],
    })
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const {code} = await post(httpUrl+"/project/add", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
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
    return{
      form,
      formLabelWidth,
      rules,
      check,
      userStoreVar,
      ruleFormRef,
      submit
    }
  }
}
</script>

<style scoped>

</style>
