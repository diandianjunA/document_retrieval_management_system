<template>
  <div>    
    <h1>{{ projectName }}</h1>
    <h2>{{ projectType }}</h2>
    <textarea v-model="projectInfo"></textarea>
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

</style>
