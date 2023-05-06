<template>
  <div class="cover">
    <div class="material">
      <h2 style="position: absolute;top: 20px;bottom: 20px;left: 20px;right: 20px">{{projectName}}</h2>
      <textarea v-model="contentValue"
                rows="10"
                cols="30"
                readonly
                class="text"></textarea>
    </div>
  </div>
</template>

<script>

import {ref} from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Material",
  props:['projectName','content'],
  setup(props){
    const contentValue=ref(0)
    // eslint-disable-next-line vue/no-setup-props-destructure
    contentValue.value=props.content
    return{
      contentValue
    }
  }
}
</script>

<style scoped>
  .material{
    position: relative;
    width: 630px;
    height: 246px;
    margin: 20px;
    background-color: #FFFFFF;
    border-radius: 25px;
    box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, .1);
    transition: all 0.5s;
  }
  .material:hover{
    width: 600px;
    height: 220px;
  }
  .cover{
    width: 630px;
    height: 246px;
    margin: 20px;
  }
  .text{
    position: absolute;
    top: 70px;
    left: 20px;
    resize: none;
    width: 540px;
    height: 160px;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    border: none;
    outline:none;
    transition: all 0.5s;
  }
  .text:hover{
    width: 510px;
    height: 130px;
  }
</style>
