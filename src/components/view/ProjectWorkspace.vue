<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="500px">
        <div style="height: 700px;width: 300px;text-align: center;margin-left: 200px;margin-top: 60px;overflow: hidden">
          <h1 style="font-size: 24px;color: #333;margin-bottom: 15px;margin-top: 15px">{{
              projectStoreVar.project.name
            }}</h1>
          <h4 style="font-size: 18px;color: #666;margin-bottom: 15px">类型： {{ projectStoreVar.project.category }}</h4>
          <h4 style="font-size: 18px;color: #666;margin-bottom: 15px">基本信息</h4>
          <el-divider/>
          <div
              style="padding-left: 10px;padding-right: 10px;height: 120px;overflow-y: scroll;font-size: 16px;width: 280px;line-height: 18px;text-align: center;font-family: Bahnschrift,serif">
            {{ projectStoreVar.project.remark }}
          </div>
          <el-divider/>
          <div class="box" @click="goToNewScheme">
            <img src="@/assets/方案选型分析.png"
                 style="width: 56px;height: 56px;position: absolute;top: 15%;left: 10%;border-radius: 28px"/>
            <div style="position: absolute;top: 18%;left: 38%;font-size: 16px;color: #666;font-weight: bold">
              方案选型分析
            </div>
            <div
                style="position: absolute;width: 150px;top: 50%;left: 38%;font-size: 13px;color: #666;font-family: Bahnschrift,serif;font-weight: bold;text-align: left">
              自动为您进行相似度比对，生成最佳方案
            </div>
          </div>
          <div class="box" @click="similarityDialog">
            <img src="@/assets/相似度计算.jpeg"
                 style="width: 56px;height: 56px;position: absolute;top: 15%;left: 10%;border-radius: 28px"/>
            <div style="position: absolute;top: 18%;left: 38%;font-size: 16px;color: #666;font-weight: bold">
              相似度计算
            </div>
            <div
                style="position: absolute;width: 150px;top: 50%;left: 38%;font-size: 13px;color: #666;font-family: Bahnschrift,serif;font-weight: bold;text-align: left">
              计算该项目与其他项目的相似程度
            </div>
          </div>
        </div>
      </el-aside>
      <el-dialog
          v-model="similarityVisible"
          title="相似度数据"
          width="40%"
      >
        <el-form
            v-model="similarityVisible"
            v-if="similarityVisible === true"
            id="main"
            style="width: 400px; height: 330px; margin: 0 auto"
        ></el-form>
        <el-pagination
            background
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="analyseData.total"
            :pager-count="navSize"
            class="mt-4"
            v-model:current-page="currentPage"
            @current-change="handleCurrentChange" style="justify-content: center;"></el-pagination>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="similarityVisible = false">
              退出
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-container>
        <el-main style="position: relative;height: 800px">
          <el-button type="danger" style="position:absolute;top: 5%;right: 5%" @click="deleteProject" round>删除项目</el-button>
          <el-divider direction="vertical" style="position: absolute;height: 600px;top: 10%"/>
          <el-button style="position: absolute;right: 48%;top: 13%" color="rgb(31,136,61)" dark="dark"
                     @click="dirNameVisible=true">新建文件夹
          </el-button>
          <el-dialog
              v-model="dirNameVisible"
              width="30%"
              title="请填写文件夹的名称"
              append-to-body
          >
            <el-input v-model="dirName" placeholder="请输入文件夹名称" required></el-input>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dirNameVisible = false">取消</el-button>
                <el-button type="primary" @click="createDir">
                  保存
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-button style="position: absolute;right: 39%;top: 13%;color: #FFFFFF" color="#409EFF" dark="dark" @click="materialFormVisible=true">
            上传文件
          </el-button>
          <el-dialog v-model="materialFormVisible" title="上传资料">
            <el-form :model="materialForm">
              <el-form-item label="资料文件" prop="file">
                <input id="materialFile" type="file"/>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="materialFormVisible = false">取消</el-button>
                <el-button type="primary" @click="uploadMaterial">
                  提交
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-button style="position: absolute;right: 30%;top: 13%" color="rgb(164,14,38)" dark="dark"
                     @click="deleteState=!deleteState">删除文件
          </el-button>
          <el-button v-if="deleteState" @click="deleteFiles" style="position: absolute;right: 23%;top: 61%"
                     color="rgb(164,14,38)" dark="dark">删除
          </el-button>
          <div style="width: 700px;height: 550px;position: absolute;top: 18%;left: 10%">
            <el-table
                ref="multipleTableRef"
                :data="fileData"
                style="width: 700px;height: 380px;font-family: Bahnschrift,serif;font-size: 16px;border-radius: 10px;border: #CDD0D6 solid 1px;"
                @selection-change="handleSelectionChange"
                :row-style="{height:'57px'}"
                @row-click="rowClick"
                @row-dblclick="rowDblclick"
            >
              <el-table-column v-if="deleteState" width="650px">
                <template #header>
                  <div style="width: 100%;height: 100%;position: relative">
                    当前路径：{{ path }}
                    <div style="position: absolute;right: 20%">点击返回上一级文件夹</div>
                  </div>
                </template>
                <template #default="{row}">
                  <img alt="" v-if="row.type==='File'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/doc.png">
                  <img alt="" v-if="row.type==='Dir'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/文件夹.png">
                  <div style="display: inline-block;width: 200px">{{ row.name }}</div>
                  <div style="display: inline-block;width: 240px;margin-left: 45px;">上次修改于
                    {{ getTime(row.lastModified) }}
                  </div>
                  <el-icon size="large" style="margin-left: 60px" v-if="row.type==='File'">
                    <Download/>
                  </el-icon>
                  <el-icon size="large" style="margin-left: 60px" v-if="row.type==='Dir'">
                    <FolderOpened/>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column v-if="!deleteState" label="Name" width="700px">
                <template #header>
                  <div style="width: 100%;height: 100%;position: relative">
                    当前路径：{{ path }}
                    <el-icon size="20px" style="position: absolute;right: 8%;top: 25%" @click="back"><Top /></el-icon>
                  </div>
                </template>
                <template #default="{row}">
                  <img v-if="row.type==='File'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/doc.png">
                  <img v-if="row.type==='Dir'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/文件夹.png">
                  <div style="display: inline-block;width: 200px">{{ row.name }}</div>
                  <div style="display: inline-block;width: 240px;margin-left: 45px">上次修改于
                    {{ getTime(row.lastModified) }}
                  </div>
                  <el-icon size="large" style="margin-left: 90px" v-if="row.type==='File'">
                    <Download/>
                  </el-icon>
                  <el-icon size="large" style="margin-left: 90px" v-if="row.type==='Dir'">
                    <FolderOpened/>
                  </el-icon>
                </template>
              </el-table-column>
              <el-table-column v-if="deleteState" type="selection" width="50"/>
            </el-table>
          </div>
          <el-table :data="schemeData" style="width: 700px;position: absolute;top: 70%;left: 10%;font-family: Bahnschrift,serif;font-size: 16px;border-radius: 10px;border: #CDD0D6 solid 1px;">
            <el-table-column>
              <template #header>
                方案
                <el-icon size="20px" style="position: absolute;right: 10%;top: 25%" @click="editScheme"><EditPen /></el-icon>
                <el-icon size="20px" style="position: absolute;right: 5%;top: 25%" @click="exportScheme"><Upload /></el-icon>
              </template>
              <template #default="{row}">
                <div v-if="!editState">
                  <h2 style="margin: 20px">{{row.name}}</h2>
                  <p style="margin: 20px">{{row.summary}}</p>
                </div>
                <div v-if="editState">
                  <el-input v-model="row.name" style="width: 85%;margin: 20px"></el-input>
                  <textarea v-model="row.summary" style="width: 85%;margin: 20px;padding: 10px;resize: none;border-color: #CDD0D6;font-family: Arial,serif"></textarea>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div>

  </div>
</template>

<script>
import {projectStore} from "@/store/projectStore";
import {Edit} from "@element-plus/icons-vue";
import router from "@/router/router";
import {getCurrentInstance, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs} from "vue";
import {get, post} from "@/request/request";
import {ElMessage, ElMessageBox} from "element-plus";
import axios from "@/request/http";
import {documentStore} from "@/store/documentStore";
import * as echarts from "echarts";

export default {
  name: "ProjectWorkspace",
  setup() {
    const {proxy} = getCurrentInstance();
    const httpUrl = proxy.$key
    const projectStoreVar = projectStore();
    const goToNewScheme = async () => {
      await router.push({path: "/index/NewScheme"})
    }
    const path = ref("/");
    const fileData = ref([]);
    const deleteList = ref([]);
    const deleteState = ref(false);
    const dirNameVisible = ref(false);
    const dirName = ref("");
    const schemeData=ref([])
    const editState=ref(false)
    const similarityVisible=ref(false);
    const currentPage=ref(1)
    const similaritys = []; /* 相似度数据 */
    const Progs = [];
    const pageSize=5
    const navSize=5
    const analyseData = ref(0);
    let chart;
    let time=null;
    const materialForm = reactive({
      file: '',
    })
    const materialFormVisible = ref(false);
    onMounted(async () => {
      {
        const {data} = await get(httpUrl + "/material/getFromCategory", {
          projectId: projectStoreVar.project.id,
          categoryPath: path.value
        })
        fileData.value = data
      }
      {
        const {data} = await get(httpUrl+"/scheme/getByProjectId",{
          projectId:projectStoreVar.project.id
        })
        schemeData.value.push(data)
      }
    })
    onBeforeUnmount(()=>{
      if(chart){
        chart.dispose()
      }
    });
    const updateCharts=(charts,state)=>{
      charts.setOption(state.option)
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
    const handleSelectionChange = (val) => {
      deleteList.value = []
      // 假设取出 id 字段
      val.forEach(item => {
        // 判断数组中是否包含这个文件
        if (deleteList.value.indexOf(item) === -1) {
          deleteList.value.push(item)
        }
      })
    }
    const getTime = (timestamp) => {
      let date = new Date(parseInt(timestamp));
      let Year = date.getFullYear();
      let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
      let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      let GMT = Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
      return GMT;
    }
    const createDir = async () => {
      const {code} = await get(httpUrl + "/material/createCategeory", {
        projectId: projectStoreVar.project.id,
        categoryName: dirName.value,
        upperPath: path.value
      })
      if (code === 200) {
        ElMessage.success("创建成功")
      } else {
        ElMessage.error("创建失败")
      }
      dirNameVisible.value = false;
      const {data} = await get(httpUrl + "/material/getFromCategory", {
        projectId: projectStoreVar.project.id,
        categoryPath: path.value
      })
      fileData.value = data
    }
    let deleteFiles = () => {
      if (deleteList.value.length === 0) {
        ElMessage.error("请至少选择一个文件或文件夹")
        return
      }
      ElMessageBox.confirm(
          '您确定要删除这些文件吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const materialIds = []
        const dirIds = []
        for (let i = 0; i < deleteList.value.length; i++) {
          if (deleteList.value[i].type === "File") {
            materialIds.push(deleteList.value[i].id)
          } else {
            dirIds.push(deleteList.value[i].name)
          }
        }
        let materialCode=200
        let dirCode=200
        if (materialIds.length !== 0) {
          const {code} = await post(httpUrl + "/material/deleteList", {
            ids: materialIds,
          })
          materialCode = code
        }
        if (dirIds.length !== 0) {
          const {code} = await post(httpUrl + "/material/deleteCategoryList", {
            projectId: projectStoreVar.project.id,
            deleteList: dirIds,
            upperPath: path.value
          })
          dirCode = code
        }
        if (materialCode === 200 && dirCode === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          const {data} = await get(httpUrl + "/material/getFromCategory", {
            projectId: projectStoreVar.project.id,
            categoryPath: path.value
          })
          fileData.value = data
        } else {
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        }
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '删除取消',
        })
      })
    };
    const uploadMaterial=async () => {
      materialFormVisible.value = false
      let formData = new FormData()
      const materialFile = document.querySelector("#materialFile");
      if (!materialFile.files.length) {
        ElMessage({
          message: '请选择文件',
          type: 'error',
        })
        return
      }
      const file = materialFile.files[0]
      formData.append('file', file)
      formData.append('projectId', projectStoreVar.project.id)
      formData.append('upperPath', path.value)
      const {data} = await axios.post(httpUrl + "/material/add", formData, {
        'Content-Type': 'multipart/form-data'
      })
      const code = data.code
      if (code === 200) {
        ElMessage({
          message: '操作成功',
          type: 'success',
        })
        const {data} = await get(httpUrl + "/material/getFromCategory", {
          projectId: projectStoreVar.project.id,
          categoryPath: path.value
        })
        fileData.value = data
      } else {
        ElMessage({
          message: data.msg,
          type: 'error',
        })
      }
    }
    const rowClick=(row)=>{
      if (time) {
        clearTimeout(time);
      }
      time = setTimeout(() => {
        if(row.type==='File'){
          axios({
            url: httpUrl+"/material/getContentById",
            method: 'get',
            responseType: 'arraybuffer',
            params:{
              id:row.id
            }
          }).then(async res => {
            const blob = new Blob([res.data]);
            let documentStoreVar = documentStore()
            documentStoreVar.construct(blob)
            await router.push({path: "/index/documentPreview"})
          })
        }
      }, 300);
    }
    const rowDblclick=async (row) => {
      if (time) {
        clearTimeout(time); //清除
      }
      if (row.type === 'Dir') {
        path.value = path.value+row.name+"/"
        const {data} = await get(httpUrl + "/material/getFromCategory", {
          projectId: projectStoreVar.project.id,
          categoryPath: path.value
        })
        fileData.value = data
      }else{
        axios({
          url: httpUrl+"/material/getDownload3",
          method: 'get',
          responseType: 'arraybuffer',
          params:{
            id:row.id
          }
        }).then(res => {
          const blob = new Blob([res.data]);
          //创建一个<a></a>标签
          let a = document.createElement("a");
          // 将流文件写入a标签的href属性值
          a.href = URL.createObjectURL(blob);
          //设置文件名
          const str = row.name+'.docx';
          a.download = str;
          // 隐藏a标签
          a.style.display = "none";
          // 将a标签追加到文档对象中
          document.body.appendChild(a);
          // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
          a.click();
          //用完就删除a标签
          a.remove();
        })
      }
    }
    const back=()=>{
      if(path.value==='/'){
        ElMessage({
          message: '已经是根目录了',
          type: 'info',
        })
      }else{
        path.value=path.value.substring(0,path.value.length-1)
        path.value=path.value.substring(0,path.value.lastIndexOf('/')+1)
        get(httpUrl + "/material/getFromCategory", {
          projectId: projectStoreVar.project.id,
          categoryPath: path.value
        }).then(res=>{
          fileData.value=res.data
        })
      }
    }
    const editScheme=async () => {
      if (editState.value === true) {
        editState.value = false
        const {code} = await post(httpUrl + "/scheme/update", {
          id: schemeData.value[0].id,
          name: schemeData.value[0].name,
          summary: schemeData.value[0].summary,
          projectId: schemeData.value[0].projectId,
          userId: schemeData.value[0].userId
        })
        if (code === 200) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '修改失败',
            type: 'error',
          })
        }
      } else {
        editState.value = true
      }
    }
    const exportScheme=async () => {
      axios({
        url: httpUrl+"/scheme/downloadDocx",
        method: 'get',
        responseType: 'arraybuffer',
        params:{
          projectId: schemeData.value[0].projectId,
        }
      }).then(res => {
        const blob = new Blob([res.data]);
        //创建一个<a></a>标签
        let a = document.createElement("a");
        // 将流文件写入a标签的href属性值
        a.href = URL.createObjectURL(blob);
        //设置文件名
        const str = schemeData.value[0].name+'.docx';
        a.download = str;
        // 隐藏a标签
        a.style.display = "none";
        // 将a标签追加到文档对象中
        document.body.appendChild(a);
        // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
        a.click();
        //用完就删除a标签
        a.remove();
      })
    }
    const similarityDialog=()=>{
      similarityVisible.value=true
      nextTick(async () => {
        {
          const {data} = await get(httpUrl + "/project/analyze", {
            projectId: projectStoreVar.project.id,
            pageNum: currentPage.value,
            navSize: navSize,
            pageSize: pageSize
          });
          analyseData.value = data;
          Progs.length = 0;
          similaritys.length = 0;
          for (let i = 0; i < data.list.length; i++) {
            Progs.push(data.list[i].name)
            similaritys.push(Math.round(data.list[i].similarity * 100))
          }
        }
        initeCharts()
      })
    }
    const deleteProject=async () => {
      ElMessageBox.confirm(
          '您确定要删除这个项目吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl + "/project/delete", {
          id: projectStoreVar.project.id
        })
        if (code === 200) {
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
          await router.push({path: "/index/ProjectManagement"})
        } else {
          ElMessage({
            message: '删除失败',
            type: 'error',
          })
        }
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '删除取消',
        })
      })
    }
    return {
      ...toRefs(state),
      handleCurrentChange,
      projectStoreVar,
      Edit,
      goToNewScheme,
      fileData,
      handleSelectionChange,
      deleteState,
      getTime,
      path,
      createDir,
      dirNameVisible,
      dirName,
      deleteFiles,
      materialForm,
      materialFormVisible,
      uploadMaterial,
      rowClick,
      rowDblclick,
      back,
      schemeData,
      editScheme,
      exportScheme,
      editState,
      similarityVisible,
      pageSize,
      navSize,
      currentPage,
      analyseData,
      similarityDialog,
      deleteProject
    };
  },
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 0 !important
}

.box {
  position: relative;
  width: 200px;
  height: 40px;
  margin: 20px auto;
  background-color: #FFFFFF;
  border-radius: 10px;
  border: #CDD0D6 solid 1px;
}

.box:hover {
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, .2);
  cursor: pointer;
}
</style>
