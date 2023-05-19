<template>
  <div class="login">
    <div class="box">
      <h2 style="margin: 80px auto;font-weight: 400;color: #3d5245;">登录</h2>
      <el-form :model="form" label-width="120px" class="pos" ref="formEl" :rules="rules">
        <el-form-item label="账号" class="item" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="密码" class="item" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
      </el-form>
      <el-button type="primary" class="button" @click="submit(formEl)">登录</el-button>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onBeforeUnmount, reactive, ref } from "vue";
import { post } from "@/request/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { userStore } from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  setup() {
    const { proxy } = getCurrentInstance();
    const httpUrl = proxy.$key
    document.querySelector('body').setAttribute('style', 'background-color: rgb(25,75,129)')
    onBeforeUnmount(() => {
      document.querySelector('body').removeAttribute('style')
    })
    const form = reactive({
      userName: '',
      password: ''
    })
    const router = useRouter();
    const formEl = ref('')
    const rules = reactive({
      userName: { required: true, message: '请输入账号', trigger: 'blur' },
      password: { required: true, message: '请输入密码', trigger: 'blur' }
    })
    let userStoreVar = userStore()
    let submit = async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          const { data, msg } = await post(httpUrl + "/user/login", form)
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
            await router.push({ path: "/index/ProjectManagement" })
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
    return {
      form,
      submit,
      formEl,
      rules
    }
  }
}
</script>

<style>
html,
body {
  margin: 0;
  font-family: "PingFang SC", "Microsoft Yahei", sans-serif;
}

.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("https://starry-lixu.oss-cn-hangzhou.aliyuncs.com/202209141908599.jpg") fixed no-repeat;
  background-size: cover;
}

.box {
  margin: 200px auto;
  width: 600px;
  height: 400px;
  display: flex;
  flex-direction: column;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 100;
  background: inherit;
  border-radius: 18px;
  overflow: hidden;
}

.box::before {
  content: "";
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  position: absolute;
  top: -10px;
  left: -10px;
  overflow: hidden;
  background: inherit;
  box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.25);
  filter: blur(6px);
  z-index: -1;
}

.pos {
  position: absolute;
  top: 35%;
  left: 17%;
}

.item .el-form-item__label {
  /* margin: 6px 0;
  height: 36px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0 14px; */
  font-size: large;
  font-weight: 400;
  color: #3d5245;
}

.button {
  width: 350px;
  margin-left: 124px;
  margin-top: 100px;
  background-color: rgba(57, 88, 69, 0.4);
  color: white;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.4s;
}</style>
