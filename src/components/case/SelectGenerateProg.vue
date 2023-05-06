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
  import {schemeStore} from "@/store/schemeStore";
  import router from "@/router/router";

  export default defineComponent({
    name: "SelectGenerateProg",

    setup() {
      const httpUrl = "http://localhost:8070";
      const projectData = ref(0);
      const analyseData = ref(0);
      const similaritys = [46, 20, 62, 12, 80]; /* 相似度数据 */
      let searchValue = ref("");
      const isShow = ref(true);
      const project = ref();
      const schemeStoreVar=schemeStore()
      const Progs = ["案例一", "案例二", "案例三", "案例四", "案例五"];
      onMounted(async () => {
        isShow.value = true;
        initeCharts();
        await primarySearch();
      });

      const search = async () => {
        const { data } = await get(httpUrl + "/project/analyze", {
          projectId: project.value,
        });
        analyseData.value = data;
        for (let i = 0; i < data.length; i++) {
          Progs[i]=data[i].name;
          similaritys[i]=Math.trunc(data[i].similarity*100);
        }
        console.log(Progs)
        initeCharts()
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

              axisLabel: {
                //x轴文字的配置
                show: true,
                interval: 0,//使x轴文字显示全
                textStyle: {
                  color: "rgba(0, 0, 0, 1)"
                },
                formatter: function(params) {
                  var newParamsName = "";
                  var paramsNameNumber = params.length;
                  var provideNumber = 3; //一行显示几个字
                  var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                  if (paramsNameNumber > provideNumber) {
                    for (var p = 0; p < rowNumber; p++) {
                      var tempStr = "";
                      var start = p * provideNumber;
                      var end = start + provideNumber;
                      if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                      } else {
                        tempStr = params.substring(start, end) + "\n";
                      }
                      newParamsName += tempStr;
                    }
                  } else {
                    newParamsName = params;
                  }
                  return newParamsName;
                }
              },
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
        myChart.on("click", async params => {
          for (let i = 0; i < analyseData.value.length; i++) {
            if (params.name === analyseData.value[i].name) {
              schemeStoreVar.construct(analyseData.value[i])
              await router.push({path: "/index/schemeTable"})
            }
          }
        });
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
