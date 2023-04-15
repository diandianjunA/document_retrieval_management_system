<template>
  <div class="login">
    <div class="box">
      <h2 style="margin: 80px auto;color: aquamarine">登录</h2>
      <el-form :model="form" label-width="120px" class="pos" ref="formEl" :rules="rules">
        <el-form-item label="账号" class="item">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="密码" class="item">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" style="position: absolute;top: 62%;left: 45%" @click="submit(formEl)">登录</el-button>
    </div>
  </div>
</template>

<script>
import {onBeforeUnmount, reactive, ref} from "vue";
import {post} from "@/request/request";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {userStore} from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  setup(){
    const httpUrl="http://localhost:8070"
    document.querySelector('body').setAttribute('style','background-color: rgb(25,75,129)')
    onBeforeUnmount(()=>{
      document.querySelector('body').removeAttribute('style')
    })
    const form=reactive({
      userName:'',
      password:''
    })
    const router = useRouter();
    const formEl=ref('')
    const rules=reactive({
      userName: { required: true, message: '请输入账号', trigger: 'blur'},
      password: { required: true, message: '请输入密码', trigger: 'blur'}
    })
    let userStoreVar=userStore()
    let submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const {data, msg} = await post(httpUrl + "/user/login", form)
          if (data === null) {
            ElMessage({
              message: msg,
              type: 'error',
            })
          } else {
            userStoreVar.construct(data)
            ElMessage({
              message: '登陆成功',
              type: 'success',
            })
            await router.push({path: "/index/modifyCase"})
          }
        } else {
          ElMessage({
            message: "请填写字段",
            type: 'error',
          })
          return false
        }
      })
    };
    return{
      form,
      submit,
      formEl,
      rules
    }
  }
}
</script>

<style>
.box{
  margin: 200px auto;
  width: 600px;
  height: 400px;
  background-color: rgb(130,77,81);
  display: flex;
  position: relative;
}
.pos{
  position: absolute;
  top: 35%;
  left: 17%;
}
.item .el-form-item__label{
  color: aliceblue;
}
</style>
