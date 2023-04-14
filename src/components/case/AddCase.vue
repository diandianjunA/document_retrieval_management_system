<template>
  <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
    <el-form-item label="员工Id" :label-width="formLabelWidth">
      <el-input v-model="form.id"/>
    </el-form-item>
    <el-form-item label="员工账户" :label-width="formLabelWidth" prop="account">
      <el-input v-model="form.account"/>
    </el-form-item>
    <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="name">
      <el-input v-model="form.name"/>
    </el-form-item>
    <el-form-item label="员工密码" :label-width="formLabelWidth" prop="password">
      <el-input type="password" v-model="form.password"/>
    </el-form-item>
    <el-form-item label="员工年龄" :label-width="formLabelWidth"  prop="age">
      <el-input v-model.number="form.age"/>
    </el-form-item>
  </el-form>
</template>

<script>
import {reactive, ref} from "vue";
import {get} from "@/request/request"
import {userStore} from "@/store/userStore";

export default {
  name: "AddCase",
  setup(){
    const httpUrl='http://localhost:8070'
    const check=ref(true)
    const userStoreVar=userStore()
    const form = reactive({
      id:'',
      account:'',
      name: '',
      password: '',
      age: '',
      sex: '',
      phone: '',
      roleId: '',
      valid: '',
    })
    const formLabelWidth='140px'
    const rules = reactive({
      name: [{ required: true,message: "请输入姓名", trigger: 'blur' }],
      account: [{validator: checkAccount, trigger: 'blur' }],
      password: [{ required: true,message: "请输入密码", trigger: 'blur' }],
      age: [{validator: checkAge, trigger: 'blur' }],
      phone: [{validator: checkPhone, trigger: 'blur' }],
      sex: [{ required: true,message: "请选择性别", trigger: 'blur' }],
      roleId: [{ required: true,message: "请选择角色", trigger: 'blur' }],
      valid: [{ required: true,message: "请选择是否禁用", trigger: 'blur' }],
    })
    let checkAccount=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账户'))
      }
      setTimeout(async () => {
        if(check.value===true){
          const {data} = await get(httpUrl+"/user/findByAccount",{account:value})
          if (data===0) {
            callback(new Error('已存在相同账户'))
          } else {
            callback()
          }
        }else {
          callback()
        }
      }, 1000)
    };
    let checkAge=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入年龄'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (value > 150) {
            callback(new Error('年龄过大'))
          } else {
            callback()
          }
        }
      }, 1000)
    };
    let checkPhone=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话号码'))
      }
      setTimeout(() => {
        if (value.length > 18) {
          callback(new Error('电话号码过长'))
        } else {
          callback()
        }
      }, 1000)
    };
    return{
      form,
      formLabelWidth,
      rules,
      check,
      userStoreVar
    }
  }
}
</script>

<style scoped>

</style>
