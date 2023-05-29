<template>
  <div>
    <el-container>
      <el-aside width="300px">
        <el-menu class="el-menu-vertical-demo">
          <div style="margin-left: 50px;margin-top: 20px;margin-bottom: 10px;font-family: Bahnschrift,serif">关键词</div>
          <el-menu-item v-for="(item,index) in categoryList" :key="index">
            <div :style="`margin-left: 10px;width: 12px;height: 12px;border-radius: 6px;background-color:`+categoryMap[item] "></div>
            <span style="margin-left: 20px">{{item}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div v-for="(item,index) in searchData" :key="index">
          <Material :name="item.name" :content="item.content" :category="item.category" :category-color="categoryMap[item.category]" @click="jump(item)"></Material>
        </div>
        <el-pagination
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total"
            pager-count="5"
            class="mt-4"
            v-model:current-page="currentPage"
            @current-change="primarySearch"
            style="margin-top: 20px;justify-content: center;"></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import {useRoute} from "vue-router";
import {getCurrentInstance, onMounted, ref} from "vue";
import {get} from "@/request/request";
import {ElMessage} from "element-plus";
import {searchStore} from "@/store/searchStore";
import Material from "@/components/component/Material";
import axios from "@/request/http";
import router from "@/router/router";
import {documentStore} from "@/store/documentStore";

export default {
  name: "SearchView",
  components: {Material},
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    let pageSize=4
    const currentPage=ref(1)
    //首先在setup中定义
    // const route = useRoute()
    const categoryMap=ref({})
    const categoryList=ref([])
    const documentStoreVar=documentStore()
    const total=ref(0)
    const searchStoreVar=searchStore()
    const primarySearch=async () => {
      const {code, data} = await get(httpUrl + "/material/getFuzzyPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        keyWord: searchStoreVar.search
      })
      if (code === 200) {
        searchData.value = data.list
        total.value = data.total
        for(let i=0;i<searchData.value.length;i++){
          if(!(searchData.value[i].category in categoryMap.value)){
            categoryMap.value[searchData.value[i].category]=randomColor()
            categoryList.value.push(searchData.value[i].category)
          }
        }
      } else {
        ElMessage.error("查询失败")
      }
    }
    onMounted(async () => {
      await primarySearch()
    })
    //query
    const searchData=ref([])
    const randomColor = require('randomcolor');
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
      searchData,
      randomColor,
      categoryMap,
      categoryList,
      pageSize,
      currentPage,
      total,
      primarySearch,
      jump,
    }
  }
}
</script>

<style scoped>

</style>
