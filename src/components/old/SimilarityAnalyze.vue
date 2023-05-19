<template>
  <div>
    <el-form style="width: 600px;height: 30px; margin: 20px auto">
      <el-select v-model="project1" placeholder="请选择所属项目">
        <el-option
            v-for="(item, index) in projectData"
            :key="index"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <el-button @click="search" type="success" style="margin-left: 10px;margin-right: 10px">查询</el-button>
      <el-select v-model="project2" placeholder="请选择所属项目">
        <el-option
            v-for="(item, index) in projectData"
            :key="index"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </el-form>
    <el-col :span="2" style="margin: 20px auto;">
      <el-statistic title="综合相似度" :value="similarity+'%'"/>
    </el-col>
    <el-form
        v-model="isShow"
        v-if="isShow == true"
        id="project1"
        style="width: 700px; height: 400px; margin: 0 auto;display: inline-block"
    ></el-form>
    <el-form
        v-model="isShow"
        v-if="isShow == true"
        id="project2"
        style="width: 700px; height: 400px; margin: 0 auto;display: inline-block"
    ></el-form>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {get} from "@/request/request";

export default {
  name: "SimilarityAnalyze",
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const isShow = ref(true);
    const projectData = ref(0);
    const projectData1 = ref(0);
    const projectData2 = ref(0);
    const project1 = ref();
    const project2 = ref();
    const similarity=ref(0);
    let chart1;
    let chart2;
    const primarySearch=async ()=>{
      const { data } = await get(httpUrl + "/project/getAll", {});
      projectData.value = data;
    }
    // 需要设置给饼图的数据
    const pieData1 = reactive([
      {
        name: '资料1',
        value: '1100'
      },
      {
        name: '资料2',
        value: '2800'
      },
      {
        name: '资料3',
        value: '4500'
      },
      {
        name: '资料4',
        value: '2202'
      },
      {
        name: '资料5',
        value: '2421'
      },
      {
        name: '资料6',
        value: '800'
      }
    ])
    // 需要设置给饼图的数据
    const pieData2 = reactive([
      {
        name: '资料1',
        value: '1100'
      },
      {
        name: '资料2',
        value: '2800'
      },
      {
        name: '资料3',
        value: '4500'
      },
      {
        name: '资料4',
        value: '2202'
      },
      {
        name: '资料5',
        value: '2421'
      },
      {
        name: '资料6',
        value: '800'
      }
    ]);
    onMounted(()=>{
      primarySearch()
      isShow.value=true
      initeCharts1()
      initeCharts2()
    })
    onBeforeUnmount(()=>{
      if(chart1){
        chart1.dispose()
      }
      if(chart2){
        chart2.dispose()
      }
    })
    const initeCharts1 = () => {
      chart1 = echarts.init(document.querySelector('#project1'));
      // 绘制图表
      chart1.setOption(state1.option);
    };
    const updateCharts=(charts,state)=>{
      charts.setOption(state.option)
    }
    const state1=reactive({
      option:{
        title: {
          text:"项目1",
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
          // itemGap设置主副标题纵向间隔，单位px，默认为10，
          itemGap: 30,
          // 主标题文本样式设置
          textStyle: {
            fontSize: 26,
            fontWeight: 'bolder',
            color: 'rgb(0,0,0)'
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}%',
          confine:true//将此限制打开后tooltip将不再溢出
        },
        series: [
          {
            type: 'pie',
            data: pieData1,
            avoidLabelOverlap: false,
            //标签
            label: {
              normal: {
                position: "inside",//此处将展示的文字在内部展示
              }
            },
          }
        ]
      }
    })
    const state2=reactive({
      option:{
        title: {
          text:"项目2",
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: 'top',
          // itemGap设置主副标题纵向间隔，单位px，默认为10，
          itemGap: 30,
          // 主标题文本样式设置
          textStyle: {
            fontSize: 26,
            fontWeight: 'bolder',
            color: 'rgb(0,0,0)'
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}%',
          confine:true//将此限制打开后tooltip将不再溢出
        },
        series: [
          {
            type: 'pie',
            data: pieData2,
            avoidLabelOverlap: false,
            label: {
              normal: {
                position: "inside",//此处将展示的文字在内部展示
              }
            },
          }
        ]
      }
    })
    const initeCharts2 = () => {
      chart2 = echarts.init(document.querySelector('#project2'));
      // 绘制图表
      chart2.setOption(state2.option);
    };
    const search=async ()=>{
      const { data } = await get(httpUrl + "/project/similarityAnalyze", {
        project1Id:project1.value,
        project2Id:project2.value
      });
      projectData1.value=data.list1
      pieData1.length=0
      for (let i = 0; i < data.list1.length; i++) {
        pieData1.push({
          name:data.list1[i].name,
          value:Math.round(data.list1[i].similarity*1000)
        })
      }
      projectData2.value=data.list2
      pieData2.length=0
      for (let i = 0; i < data.list2.length; i++) {
        pieData2.push({
          name:data.list2[i].name,
          value:Math.round(data.list2[i].similarity*1000)
        })
      }
      similarity.value=Math.round(data.similarity*100)
      updateCharts(chart1,state1)
      updateCharts(chart2,state2)
    }
    return{
      isShow,
      project1,
      project2,
      projectData,
      search,
      projectData1,
      projectData2,
      similarity
    }
  }
}
</script>

<style scoped>

</style>
