<template>
  <div class="Header">
    <div class="block">
      <el-row>
        <el-col :span="2" style="position:relative;" @click="collapse">
          <el-icon size="20" style="position:absolute;top: 18px;left: 15px;right: 0;bottom: 0"><Fold /></el-icon>
        </el-col>
        <el-col :span="16" style="position: relative">
          <div style="background-color: rgb(0,0,0,0);height: 55px;width: 1px;float: left"></div>
          <div style="font-size: 30px;position: absolute;margin: auto;top: 8px;left: 50%;right: 0;bottom: 0">文档检索系统</div>
        </el-col>
        <el-col :span="6" style="position:relative;">
          <el-dropdown style="position:absolute;top: 20px;right: 20px">
            <span class="el-dropdown-link" style="color: aliceblue;">
              {{ userStoreVar.user.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item @click="quit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {ref} from "vue"
import { ArrowDown } from '@element-plus/icons-vue'
import {sidebarStore} from "@/store/sidebarStore";
import {userStore} from "@/store/userStore";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "@/router/router";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  components:{
    ArrowDown
  },
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let circleUrl=ref("http://www.diandianjun.com.cn:8080/resource/blog/dora1.jpg")
    let sidebarStoreVar=sidebarStore()
    let userStoreVar=userStore()
    let collapse=()=> {
      sidebarStoreVar.change()
    }
    let quit=()=>{
      ElMessageBox.confirm(
          '您确定要退出登录吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
            ElMessage({
              type: 'success',
              message: '退出成功',
            })
            userStoreVar.user.id = ''
            userStoreVar.user.userName = ''
            userStoreVar.user.password = ''
            userStoreVar.user.status = ''
            await router.push({path: "/login"})
          }).catch(() => {
            ElMessage({
              type: 'info',
              message: '退出取消',
            })
          })
    };
    return{
      circleUrl,
      collapse,
      userStoreVar,
      quit
    }
  }
}
</script>

<style scoped>
.Header{
  height: 100%;
  background-color: rgb(72,162,255);
  margin: 0;
  padding: 0;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
