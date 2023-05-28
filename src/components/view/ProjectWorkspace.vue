<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="300px">Aside</el-aside>
      <el-container>
        <el-header style="text-align: center;position: relative" height="300px">
          <el-button style="position: absolute;top: 20px;right: 50px" type="primary" round @click="goToNewScheme">方案选型分析</el-button>
          <h1 style="font-size: 24px;color: #333;margin: 20px;">{{ projectStoreVar.project.name }}</h1>
          <h4 style="font-size: 18px;color: #666;margin: 20px;">类型： {{ projectStoreVar.project.category }}</h4>
          <h4 style="font-size: 18px;color: #666;margin: 20px;">基本信息</h4>
          <el-button color="#626aef" dark="dark" :icon="Edit" style="position: absolute;right: 580px;top: 115px"/>
          <el-divider />
          <div style="padding-left: 20%;padding-right: 20%;height: 80px;overflow-y: scroll;">{{projectStoreVar.project.remark}}</div>
          <el-divider />
        </el-header>
        <el-main style="">
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div>

  </div>
</template>

<script>
import {projectStore} from "@/store/projectStore";
import { Edit} from '@element-plus/icons-vue'
import router from "@/router/router";
export default {
  name: "ProjectWorkspace",
  setup() {
    const projectStoreVar = projectStore();
    const goToNewScheme=async () => {
      await router.push({path: "/index/NewScheme"})
    }
    return {
      projectStoreVar,
      Edit,
      goToNewScheme
    };
  },
}
</script>

<style scoped>
.search-box {
  /* 主搜索框样式 */
}

.project-section {
  border: 1px solid #ebeef5;
  width: 350px;
  height: 600px;
}

.project-section h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.project-section h4 {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}

.project-section textarea {
  width: 100%;
  height: 200px;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
::-webkit-scrollbar { width: 0 !important }
</style>
