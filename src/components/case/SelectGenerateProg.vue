<template>
    <div class="SelectGenerateProg">
      <el-form id="search" style="width: 400px; height: 100px; margin: 0 auto">
        <el-select v-model="project" placeholder="请选择所属项目">
          <el-option
            v-for="(item, index) in projectData"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button @click="search" type="success">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form>
  
      <el-form
        v-model="isShow"
        v-if="isShow == true"
        id="main"
        style="width: 600px; height: 400px; margin: 0 auto"
      ></el-form>
    </div>
  </template>
  
  <script>
  import { get } from "@/request/request";
  import { defineComponent, toRefs, reactive, onMounted, ref } from "vue";
  import * as echarts from "echarts";
  
  export default defineComponent({
    name: "SelectGenerateProg",
  
    setup() {
      const httpUrl = "http://www.diandianjun.com.cn:8070";
      const projectData = ref(0);
      const analyseData = ref(0);
      const similaritys = [46, 20, 62, 12, 10, 80]; /* 相似度数据 */
      let searchValue = ref("");
      const isShow = ref(true);
      const project = ref();
  
      const Progs = ["案例一", "案例二", "案例三", "案例四", "案例五", "案例六"];
      onMounted(async () => {
        isShow.value = true;
        initeCharts();
        await primarySearch();
      });
  
      const search = async () => {
        const { data } = await get(httpUrl + "/scheme/analyse", {
          projectId: project.value,
        });
        analyseData.value = data;
        getSimilaritys();
      };
      const primarySearch = async () => {
        {
          const { data } = await get(httpUrl + "/project/getAll", {});
          projectData.value = data;
        }
      };
      const reset = () => {
        searchValue.value = "";
        project.value = "";
        primarySearch();
      };
      const state = reactive({
        option: {
          grid: {
            top: "4%",
            left: "2%",
            right: "4%",
            bottom: "0%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              /*填入横坐标*/
              data: Progs,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
            },
          ],
          series: [
            {
              name: "方案",
              type: "bar",
              barWidth: "40%",
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: "inside", //数据在中间显示
                    formatter: "{c}%", //百分比显示
                  },
                },
              },
              data: similaritys, //你要展示的数据
            },
          ],
        },
      });
      const initeCharts = () => {
        let myChart = echarts.init(document.getElementById("main"));
        // 绘制图表
        myChart.setOption(state.option);
        myChart.on("click", params => {
          alert(params.name)
        });
      };
      const getSimilaritys = () => {
        //从analyseData中获得数据，相似度和名字
      };
      return {
        ...toRefs(state),
        searchValue,
        httpUrl,
        search,
        reset,
        projectData,
        project,
        isShow,
      };
    },
  });
  </script>
  
  <style>
  </style>
  