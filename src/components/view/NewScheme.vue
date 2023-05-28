<template>
  <div>
    <el-table
        :data="materialData" row-key="id" ref="materialTableRef"
        style="width: 250px;height: 318px;position: absolute;left: 8%;top: 10%" border @selection-change="materialSelection">
      <el-table-column type="selection" :reserve-selection="true"/>
      <el-table-column
          prop="name"
          label="资料"
          width="200px">
      </el-table-column>
    </el-table>
    <el-table
        :data="projectData" row-key="id" ref="projectTableRef"
        style="width: 250px;height: 318px;position: absolute;right: 8%;top: 10%" border @selection-change="projectSelection">
      <el-table-column
          prop="name"
          label="项目"
          width="200px">
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true"/>
    </el-table>
    <el-descriptions
        class="margin-top"
        :column="1"
        size="default"
        border
        style="width: 800px;height: 318px;position: absolute;top: 10%;left: 0;right: 0;margin: auto;"
    >
      <el-descriptions-item width="150px">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <el-icon><Star /></el-icon>
            </el-icon>
            项目名称
          </div>
        </template>
        {{ projectStoreVar.project.name }}
      </el-descriptions-item>
      <el-descriptions-item width="150px">
        <template #label>
          <div class="cell-item">
            <el-icon><Collection /></el-icon>
            项目类型
          </div>
        </template>
        <el-tag>{{projectStoreVar.project.category}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            所属用户
          </div>
        </template>
        {{ userStoreVar.user.userName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <tickets />
            </el-icon>
            简介
          </div>
        </template>
        {{projectStoreVar.project.remark}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <el-icon><Bell /></el-icon>
            </el-icon>
            相似度说明
          </div>
        </template>
        本页面展示了基于项目所属资料的相似度分析结果。您可以在左侧选择参与方案生成的资料，在右侧选择参与方案生成的项目，系统将自动生成方案。
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <el-icon><DataAnalysis /></el-icon>
            </el-icon>
            相似度
          </div>
        </template>
        <el-form
            v-model="isShow"
            v-if="isShow === true"
            id="main"
            style="width: 400px; height: 330px; margin: 0 auto"
        >
        </el-form>
        <el-pagination
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="analyseData.total"
            :pager-count="navSize"
            class="mt-4"
            v-model:current-page="currentPage"
            @current-change="handleCurrentChange" style="justify-content: center;"></el-pagination>
      </el-descriptions-item>
    </el-descriptions>
    <div style="position: absolute;bottom: 10%;left: 50%;transform: translate(-50%,-50%);">
      生成方案的字数：<el-input-number v-model="num" :min="10" :max="250"/>
    </div>
    <el-button type="success" round style="position: absolute;bottom: 3%;left: 50%;transform: translate(-50%,-50%);" @click="generate">方案生成</el-button>
    <el-dialog
        v-model="dialogVisible"
        title="方案生成"
        width="30%"
        :before-close="handleClose"
    >
      <span>{{scheme.summary}}</span>
      <el-dialog
          v-model="innerVisible"
          width="30%"
          title="请填写方案名称"
          append-to-body
      >
        <el-input v-model="scheme.name" placeholder="请输入方案名称" required></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="innerVisible = false">取消</el-button>
            <el-button type="primary" @click="saveScheme">
              保存
            </el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadScheme">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {get, post} from "@/request/request";
import {defineComponent, toRefs, reactive, onMounted, ref, onBeforeUnmount, getCurrentInstance} from "vue";
import * as echarts from "echarts";

import {projectStore} from "@/store/projectStore";
import {userStore} from "@/store/userStore";
import {ElMessage, ElMessageBox} from "element-plus";
export default defineComponent({
  name: "NewScheme",
  setup(){
    const materialTableRef = ref();
    const projectTableRef = ref();
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const analyseData = ref(0);
    const pageSize=5
    const navSize=5
    const currentPage=ref(1)
    const similaritys = []; /* 相似度数据 */
    const isShow = ref(true);
    const material =ref();
    const materialData = ref([]);
    const projectData = ref([]);
    const projectStoreVar=projectStore()
    const userStoreVar=userStore()
    const num=ref(50)
    const scheme=reactive({
      summary:"",
      name:""
    });
    const dialogVisible = ref(false);
    const innerVisible = ref(false);
    const materialIds=ref([])
    const projectIds=ref([])
    const handleClose = () => {
      ElMessageBox.confirm('Are you sure to close this dialog?')
          .then(() => {
            dialogVisible.value = false;
          })
    }
    const Progs = [];
    let chart;
    onMounted(async () => {
      isShow.value = true;
      await primarySearch();
      initeCharts();
    });
    onBeforeUnmount(()=>{
      if(chart){
        chart.dispose()
      }
    });
    const newScheme=async()=>{
      //生成新的方案
      //value1存储资料，value2存储其它项目
      const { data } = await get(httpUrl + "/scheme/generate", {

      });
      console.log(data);
    }
    const handleCurrentChange = async () => {
      const { data } = await get(httpUrl + "/project/analyze", {
        projectId: projectStoreVar.project.id,
        pageNum: currentPage.value,
        navSize: navSize,
        pageSize: pageSize
      });
      analyseData.value=data;
      Progs.length=0;
      similaritys.length=0;
      for (let i = 0; i < data.list.length; i++) {
        Progs.push(data.list[i].name)
        similaritys.push(Math.round(data.list[i].similarity*100))
      }
      updateCharts(chart,state)
    };
    const updateCharts=(charts,state)=>{
      charts.setOption(state.option)
    }
    const primarySearch = async () => {
      {
        const { data } = await get(httpUrl + "/material/getByProjectId", {
          projectId: projectStoreVar.project.id,
        });
        materialData.value = data;
      }
      {
        const { data } = await get(httpUrl + "/project/analyze", {
          projectId: projectStoreVar.project.id,
          pageNum:currentPage.value,
          navSize:navSize,
          pageSize:pageSize
        });
        analyseData.value = data;
        Progs.length=0;
        similaritys.length=0;
        for (let i = 0; i < data.list.length; i++) {
          Progs.push(data.list[i].name)
          similaritys.push(Math.round(data.list[i].similarity*100))
        }
      }
      {
        const { data } = await get(httpUrl + "/project/getAll", {});
        projectData.value = data;
      }
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
      chart = echarts.init(document.getElementById("main"));
      // 绘制图表
      chart.setOption(state.option);
      chart.on("click", async params => {
        console.log(params);
      });
    };
    const generate=async()=>{
      if(materialIds.value.length===0){
        ElMessage.error("请至少选择一个资料")
        return
      }
      if(projectIds.value.length===0){
        ElMessage.error("请至少选择一个项目")
        return
      }
      const { data } = await get(httpUrl + "/scheme/generateMulti", {
        materialIds: JSON.stringify(materialIds.value),
        projectIds: JSON.stringify(projectIds.value),
        length: num.value
      });
      scheme.value=data;
      scheme.summary="方案1"
      dialogVisible.value=true
    }
    const materialSelection = (val)=>{
      materialIds.value = []
      // 假设取出 id 字段
      val.forEach(item => {
        const id = item.id
        // 判断数组中是否包含这个 id
        if (materialIds.value.indexOf(id) === -1) {
          materialIds.value.push(id)
        }
      })
    }
    const projectSelection = (val)=>{
      projectIds.value = []
      // 假设取出 id 字段
      val.forEach(item => {
        const id = item.id
        // 判断数组中是否包含这个 id
        if (projectIds.value.indexOf(id) === -1) {
          projectIds.value.push(id)
        }
      })
    }
    const uploadScheme=()=>{
      innerVisible.value=true
    }
    const saveScheme=async()=>{
      if(scheme.name===''){
        ElMessage.error("方案名称不能为空")
        return
      }
      const { code,data } = await post(httpUrl + "/scheme/save", {
        projectId: projectStoreVar.project.id,
        name: scheme.name,
        summary: scheme.summary,
      });
      if(code===200){
        ElMessage.success("保存成功")
        return
      }else{
        ElMessage.error(data.msg)
      }
      innerVisible.value=false
    }
    return{
      ...toRefs(state),
      value:'',
      httpUrl,
      newScheme,
      material,
      isShow,
      analyseData,
      pageSize,
      currentPage,
      navSize,
      handleCurrentChange,
      materialTableRef,
      projectTableRef,
      materialData,
      projectStoreVar,
      projectData,
      num,
      userStoreVar,
      generate,
      scheme,
      dialogVisible,
      handleClose,
      materialSelection,
      projectSelection,
      uploadScheme,
      innerVisible,
      saveScheme
    }
  },
})

</script>

<style scoped>
</style>
