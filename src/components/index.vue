<template>
  <h1>文档检索管理系统</h1>
  <form method="post" action="http://localhost:8070/file/upload" enctype="multipart/form-data">
    <input name="file" type="file"  />
    <input type="submit" value="提交" />
  </form>
  <form method="get" action="http://localhost:8070/file/download">
    <input name="fileName" type="text"  />
    <input type="submit" value="提交" />
  </form>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "index",
  setup(){

  }
}
</script>

<style scoped>

</style>
