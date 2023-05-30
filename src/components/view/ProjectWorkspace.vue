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
          <div class="box">
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
      <el-container>
        <el-main style="position: relative;height: 800px">
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
          <el-button style="position: absolute;right: 39%;top: 13%;color: #FFFFFF" color="#409EFF" dark="dark">
            上传文件
          </el-button>
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
            >
              <el-table-column v-if="deleteState" width="650px">
                <template #header>
                  当前路径：{{ path }}
                </template>
                <template #default="{row}">
                  <img v-if="row.type==='File'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/doc.png">
                  <img v-if="row.type==='Dir'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/文件夹.png">
                  <div style="display: inline-block;width: 200px">{{ row.name }}</div>
                  <div style="display: inline-block;width: 230px;margin-left: 45px">上次修改于
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
              <el-table-column v-if="!deleteState" label="Name" width="700px">
                <template #header>
                  当前路径：{{ path }}
                </template>
                <template #default="{row}">
                  <img v-if="row.type==='File'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/doc.png">
                  <img v-if="row.type==='Dir'" style="width: 20px;height: 20px;margin-right: 20px"
                       src="@/assets/文件夹.png">
                  <div style="display: inline-block;width: 200px">{{ row.name }}</div>
                  <div style="display: inline-block;width: 230px;margin-left: 45px">上次修改于
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
        </el-main>
      </el-container>
    </el-container>
  </div>
  <div>

  </div>
</template>

<script>
import {projectStore} from "@/store/projectStore";
import {Edit} from '@element-plus/icons-vue'
import router from "@/router/router";
import {getCurrentInstance, onMounted, ref} from "vue";
import {get, post} from "@/request/request";
import {ElMessage, ElMessageBox} from "element-plus";

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
    onMounted(async () => {
      {
        const {data} = await get(httpUrl + "/material/getFromCategory", {
          projectId: projectStoreVar.project.id,
          categoryPath: path.value
        })
        fileData.value = data
      }
    })
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
        let materialCode
        let dirCode
        if (materialIds.length !== 0) {
          const {code} = await post(httpUrl + "/material/deleteList", {
            ids: materialIds,
          })
          materialCode = code
        }
        if (dirIds.length !== 0) {
          const {code} = await post(httpUrl + "/material/deleteDirList", {
            projectId: projectStoreVar.project.id,
            ids: dirIds,
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
    return {
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
      deleteFiles
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
