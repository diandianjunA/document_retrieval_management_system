<template>
  <div ref="childRef" class="doc-preview"></div>
</template>

<script>
import * as docx from "docx-preview";
import {documentStore} from "@/store/documentStore";
import {onMounted} from "vue";

export default {
  name: "DocumentPreview",
  setup(){
    onMounted(()=>{
      const documentStoreVar=documentStore()
      let childRef = document.getElementsByClassName("doc-preview")
      docx.renderAsync(documentStoreVar.document, childRef[0]).then(
          (x) => {
            console.log(x);
          }
      )
    })
  }
}
</script>

<style scoped>
.doc-preview {
  width: 100%;
  background-color: #f5f5f5;
}
</style>
