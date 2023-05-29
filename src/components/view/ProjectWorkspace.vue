<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="500px">
        <div style="height: 700px;width: 300px;text-align: center;margin-left: 200px;margin-top: 60px;overflow: hidden">
          <h1 style="font-size: 24px;color: #333;margin-bottom: 15px;margin-top: 15px">{{ projectStoreVar.project.name }}</h1>
          <h4 style="font-size: 18px;color: #666;margin-bottom: 15px">类型： {{ projectStoreVar.project.category }}</h4>
          <h4 style="font-size: 18px;color: #666;margin-bottom: 15px">基本信息</h4>
          <el-divider />
          <div style="padding-left: 10px;padding-right: 10px;height: 120px;overflow-y: scroll;font-size: 16px;width: 280px;line-height: 18px;text-align: center;font-family: Bahnschrift,serif">{{projectStoreVar.project.remark}}</div>
          <el-divider />
          <div class="box">
            <img src="@/assets/方案选型分析.png" style="width: 56px;height: 56px;position: absolute;top: 15%;left: 10%;border-radius: 28px"/>
            <div style="position: absolute;top: 18%;left: 38%;font-size: 16px;color: #666;font-weight: bold">方案选型分析</div>
            <div style="position: absolute;width: 150px;top: 50%;left: 38%;font-size: 13px;color: #666;font-family: Bahnschrift,serif;font-weight: bold;text-align: left">自动为您进行相似度比对，生成最佳方案</div>
          </div>
          <div class="box">
            <img src="@/assets/相似度计算.jpeg" style="width: 56px;height: 56px;position: absolute;top: 15%;left: 10%;border-radius: 28px"/>
            <div style="position: absolute;top: 18%;left: 38%;font-size: 16px;color: #666;font-weight: bold">相似度计算</div>
            <div style="position: absolute;width: 150px;top: 50%;left: 38%;font-size: 13px;color: #666;font-family: Bahnschrift,serif;font-weight: bold;text-align: left">计算该项目与其他项目的相似程度</div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-main style="position: relative;height: 800px">
          <el-divider direction="vertical" style="position: absolute;height: 600px;top: 10%"/>
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
::-webkit-scrollbar { width: 0 !important }

.box{
  position: relative;
  width: 200px;
  height: 40px;
  margin: 20px auto;
  background-color: #FFFFFF;
  border-radius: 10px;
  border: #CDD0D6 solid 1px;
}
.box:hover {
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, .2);
  cursor: pointer;
}
</style>
