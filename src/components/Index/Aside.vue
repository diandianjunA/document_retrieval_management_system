<template>
  <div class="Aside">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="sidebarStoreVar.collapse"
        style="border: none"
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Document /></el-icon>
          <h4 v-if="!sidebarStoreVar.collapse">案例库管理</h4>
        </template>
        <el-menu-item-group title="新建">
          <el-menu-item index="1-1" @click="goToAddCase()">
            <el-icon><DocumentAdd /></el-icon>
            新增案例项目
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="修改" @click="goToModifyCase()">
          <el-menu-item index="1-2">
            <el-icon><DocumentDelete /></el-icon>
            修改项目信息
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="上传与下载">
          <el-menu-item index="1-3" @click="goToUpload()">
            <el-icon><Top /></el-icon>
            案例资料列表
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Iphone /></el-icon>
          <h4 v-if="!sidebarStoreVar.collapse">相似度计算</h4>
        </template>
        <el-menu-item-group title="计算" @click="goToSimilarityAnalyze">
          <el-menu-item index="2-1">
            <el-icon><Monitor /></el-icon>
            计算案例相似度
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><Search /></el-icon>
          <h4 v-if="!sidebarStoreVar.collapse">文档查询</h4>
        </template>
        <el-menu-item-group title="查询">
          <el-menu-item index="3-1" @click="goToFuzzySearch">
            <el-icon><FolderOpened /></el-icon>
            文档模糊查询
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          <el-icon><Printer /></el-icon>
          <h4 v-if="!sidebarStoreVar.collapse">新方案管理</h4>
        </template>
        <el-menu-item index="4-1" @click="goToSelectGenerateProg()">
          <el-icon><Reading /></el-icon>
          方案选型分析
        </el-menu-item>
        <el-menu-item index="4-2" @click="goToSelectonResults()">
          <el-icon><DocumentCopy /></el-icon>
          方案生成
        </el-menu-item>
        <el-menu-item index="4-3" @click="goToProgrammeManage()">
          <el-icon><DataLine /></el-icon>
          方案管理
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script>
import {sidebarStore} from "@/store/sidebarStore";
import {userStore} from "@/store/userStore";
import router from "@/router/router";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Aside",
  components:{

  },
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let sidebarStoreVar=sidebarStore()
    let useStore=userStore()
    const goToAddCase=async () => {
      await router.push({path: "/index/addCase"})
    }
    const goToModifyCase=async ()=>{
      await router.push({path: "/index/modifyCase"})
    }
    const goToUpload=async ()=>{
      await router.push({path: "/index/uploadMaterial"})
    }
    const goToSelectonResults=async ()=>{
      await router.push({path: "/index/selectionResults"})
    }
    const goToProgrammeManage=async ()=>{
      await router.push({path: "/index/programmeManage"})
    }
    const goToSelectGenerateProg=async ()=>{
      await router.push({path: "/index/SelectGenerateProg"})
    }
    const goToFuzzySearch=async ()=>{
      await router.push({path: "/index/FuzzySearch"})
    }
    const goToSimilarityAnalyze=async ()=>{
      await router.push({path: "/index/SimilarityAnalyze"})
    }
    return{
      sidebarStoreVar,
      useStore,
      goToAddCase,
      goToModifyCase,
      goToUpload,
      goToSelectonResults,
      goToProgrammeManage,
      goToSelectGenerateProg,
      goToFuzzySearch,
      goToSimilarityAnalyze
    }
  }
}
</script>

<style scoped>
.Aside{
  height: 100%;
  margin: 0;
  padding: 0;
}
.AsideCollapse{
  width: 50px;
}
</style>
