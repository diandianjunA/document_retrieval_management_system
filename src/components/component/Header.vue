<template>
  <div class="Header">
    <el-menu :default-active="activeIndex" mode="horizontal">
      <div class="input_box">
        <el-input
            v-model="searchStoreVar.search"
            placeholder="搜索关键字">
          <template #append>
            <el-button @click="search">
              <el-icon style="color: black">
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-menu-item style="margin-left: 400px" index="1" @click="goToProjectManagement">历史项目管理</el-menu-item>
      <el-menu-item index="2" @click="goToNewScheme">新方案生成</el-menu-item>
      <el-dropdown style="position:absolute;top: 20px;right: 40px">
            <span class="el-dropdown-link" style="color: black;">
              {{ userStoreVar.user.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="jump">个人中心</el-dropdown-item>
            <el-dropdown-item @click="quit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-menu>
  </div>
</template>

<script>
import { ArrowDown } from '@element-plus/icons-vue'
import {userStore} from "@/store/userStore";
import {ElMessage, ElMessageBox} from "element-plus";
import {inject, ref} from "vue";
import {Search} from '@element-plus/icons-vue'
import {searchStore} from "@/store/searchStore";
import {onBeforeRouteUpdate, useRouter} from "vue-router";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Header",
  components:{
    ArrowDown
  },
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let userStoreVar=userStore()
    const activeIndex = ref('1')
    const searchStoreVar=searchStore()
    searchStoreVar.construct("")
    const reload=inject("reload")
    let router=useRouter()
    onBeforeRouteUpdate((to) => {
      if ((to.path!=='/index/SearchView'&&to.path!=='/#/index/SearchView')) {
        searchStoreVar.construct("")
      }
    })
    const search = async () => {
      //发送
      if(router.currentRoute.value.path==='/index/SearchView'||router.currentRoute.value.path==='/#/index/SearchView'){
        reload()
      }else{
        await router.push({path: "/index/SearchView"})
      }
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
    const goToProjectManagement=async () => {
      await router.push({path: "/index/ProjectManagement"})
    }
    let jump=async ()=>{
      await router.push({path: "/index/ProjectManagement"})
    }
    const goToNewScheme=async () => {
      await router.push({path: "/index/NewScheme"})
    }
    return{
      activeIndex,
      userStoreVar,
      quit,
      searchStoreVar,
      search,
      Search,
      goToProjectManagement,
      jump,
      goToNewScheme
    }
  }
}
</script>

<style scoped>
.Header{
  height: 100%;
  margin: 0;
  padding: 0;
}

/*搜索组件最外层div */
.input_box {
  width: 300px;
  height: 33px;
  margin-top: 15px;
  margin-left: 20px;
  border-radius: 95px;
  background: whitesmoke;
}
/*搜索input框 */
:deep(.el-input__wrapper) {
  background-color: transparent;/*覆盖原背景颜色，设置成透明 */
  border-radius: 95px;
  border: 0;
  box-shadow: 0 0 0 0px;
}
/*搜索button按钮 */
:deep(.el-input-group__append) {
  background: rgb(64,158,255);
  border-radius: 95px;
  border: 0;
  box-shadow: 0 0 0 0px;
}
</style>
