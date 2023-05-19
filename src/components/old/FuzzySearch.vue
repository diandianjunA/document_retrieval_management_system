<template>
  <div class="fuzzySearch">
    <div style="margin: 0 auto">
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
      <el-button @click="search" type="success">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
    </div>
    <div>
      <div v-for="(item,index) in searchData" :key=index>
        <Material forceRender :key="timer" :projectName="item.name" :content="item.content" style="margin: 20px 20px;float: left" @click="jump(item)"></Material>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import {get} from "@/request/request";
import Material from "@/components/case/Material";
import axios from "@/request/http";
import router from "@/router/router";
import {documentStore} from "@/store/documentStore";

export default {
  name: "FuzzySearch",
  components: {Material},
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const pageSize=3
    let currentPage=ref(1)
    let searchValue=ref("")
    const searchData=ref(0)
    const documentStoreVar=documentStore()
    let timer;
    watch(searchData,()=>{
      timer=new Date().getTime()
    })
    onMounted(async () => {
      await primarySearch()
    })
    const primarySearch=async () => {
      const {data} = await get(httpUrl+"/material/getFuzzyPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        keyWord: ""
      })
      searchData.value=data
    }
    const search=async ()=>{
      if(searchValue.value===''){
        const {data} = await get(httpUrl+"/material/getFuzzyPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          keyWord: ''
        })
        searchData.value=data
      }else{
        const {data} = await get(httpUrl+"/material/getFuzzyPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          keyWord: searchValue.value
        })
        searchData.value=data
      }
    }
    const reset=async ()=>{
      searchValue.value=''
      await primarySearch()
    }
    const prePage = () => {
      if(currentPage.value>1){
        currentPage.value=currentPage.value-1
        search()
      }
    }
    const nextPage=()=>{
      if(searchData.value.length!==0){
        currentPage.value=currentPage.value+1
        search()
      }
    }
    const jump=(item)=>{
      axios({
        url: httpUrl+"/material/getContent",
        method: 'get',
        responseType: 'arraybuffer',
        params:{
          location:item.location
        }
      }).then(async res => {
        const blob = new Blob([res.data]);
        documentStoreVar.construct(blob)
        await router.push({path: "/index/documentPreview"})
      })
    }
    return{
      searchValue,
      searchData,
      search,
      reset,
      prePage,
      nextPage,
      jump,
      timer
    }
  }
}
</script>

<style scoped>
  .prePage{
    height: 60px;
    width: 60px;
    border-radius: 30px;
    background-color: #FFFFFF;
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, .2);
    margin-left: 10px;
    margin-right: 10px;
    transition: all 0.5s;
    position: fixed;
    top: 150px;
    left: 400px;
  }
  .nextPage{
    height: 60px;
    width: 60px;
    border-radius: 30px;
    background-color: #FFFFFF;
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, .2);
    margin-left: 10px;
    margin-right: 10px;
    transition: all 0.5s;
    position: fixed;
    top: 150px;
    right: 200px;
  }
</style>
