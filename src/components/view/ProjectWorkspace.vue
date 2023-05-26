<template>
  <div>
    <div class="search-box">
      <!-- 主搜索框的代码 -->
    </div>

    <div class="project-section">
      <h1>{{ projectName }}</h1>
      <h2>{{ projectType }}</h2>
      <textarea v-model="projectInfo"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectWorkspace",
  data() {
    return {
      projectName: "",
      projectType: "",
      projectInfo: ""
    };
  },
  created() {
    this.projectName = this.$store.state.projectStore.projectName;
    this.projectType = this.$store.state.projectStore.projectType;
    this.projectInfo = this.$store.state.projectStore.projectInfo;
  }
}
</script>

<style scoped>
.search-box {
  /* 主搜索框样式 */
}

.project-section {
  width: 50%;
  margin-top: 20px;
}

.project-section h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.project-section h2 {
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
</style>
