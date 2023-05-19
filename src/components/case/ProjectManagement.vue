<template>
  <div>
    <div>
      <div style="margin: 0 auto;position:relative;height: 90px">
        <el-input v-model:model-value="searchValue" placeholder="查询历史项目" suffix-icon="Search" style="width: 400px;height: 40px;position: absolute;top: 30px;left: 600px" @keydown.enter="search"></el-input>
        <el-button @click="search" color="rgb(205,240,217)" style="position: absolute;top: 33px;left: 1010px;color: black" round>查询</el-button>
        <el-button @click="reset" color="rgb(133,211,253)" style="position: absolute;top: 33px;left: 1070px;color: white" round>重置</el-button>
        <el-button @click="add" type="success" style="position: absolute;top: 33px;right: 80px;color: white" round>新建项目</el-button>
      </div>
    </div>
    <div style="z-index: 9;position: absolute;width: 300px;height: 200px;left: 100px;top: 180px;text-align: center;">
      <h2 style="pointer-events:auto;">欢迎来到</h2>
      <h2>文档检索管理系统</h2>
      <br>
      <h3>{{userStoreVar.user.userName}} 用户</h3>
      <br>
      <h3>现在的时间是</h3>
      <br>
      <h3>
        {{ timeInfo.nowDate }} {{ timeInfo.nowWeek }} {{ timeInfo.nowTime }}
      </h3>
    </div>
    <div style="border: 1px solid #ebeef5;width: 350px;position: absolute;top: 400px;left: 100px"></div>
    <div style="z-index: 9;position: absolute;width: 300px;height: 400px;left: 120px;top: 420px;padding: 10px;">
      <h2>操作记录</h2>
      <div v-for="(item,index) in recordData" :key="index">
        <div style="line-height: 40px">{{item.information}}</div>
        <div>{{item.time}}</div>
      </div>
      <el-button class="moreLink" type="primary" link text @click="more">更多</el-button>
    </div>
    <el-dialog v-model="dialogTableVisible" title="操作记录" @close="recordClose">
      <el-input v-model:model-value="searchValueForRecord" placeholder="查询记录" suffix-icon="Search" style="width: 220px;margin-left: 250px" @keydown.enter="search"></el-input>
      <el-button @click="searchForRecord" color="rgb(205,240,217)" style="position: absolute;top: 85px;left: 500px;color: black" round>查询</el-button>
      <el-button @click="resetForRecord" color="rgb(133,211,253)" style="position: absolute;top: 85px;left: 550px;color: white" round>重置</el-button>
      <div class="block">
        <el-date-picker
            v-model="dateChoice"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            size="default"
            style="margin-left: 250px;margin-top: 10px;margin-bottom: 10px"
        />
      </div>
      <div style="overflow: auto;height: 300px">
        <el-table :data="recordData2">
          <el-table-column label="操作人" width="150">{{userStoreVar.user.userName}}</el-table-column>
          <el-table-column property="time" label="操作时间" width="200"></el-table-column>
          <el-table-column property="information" label="操作信息"></el-table-column>
          <el-table-column fixed="right" label="操作" width="220px">
            <template #default="scope">
              <el-button type="danger" size="small" @click="handleDeleteForRecord(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <div style="border: 1px solid #ebeef5;margin-top: 20px;height: 670px;margin-left: 530px;position: absolute"></div>
    <div style="position: relative;">
      <div style="border: 1px solid #ebeef5;width: 750px;margin-left: 600px"></div>
      <div v-for="(item,index) in projectData.list" :key=index>
        <div class="projectItem">
          <h2>{{item.name}}</h2>
          <h4 style="margin-top: 10px;margin-bottom: 10px">{{item.category}}</h4>
          <textarea v-model="item.remark"
                    rows="10"
                    cols="30"
                    readOnly
                    class="text"></textarea>
        </div>
        <div style="border: 1px solid #ebeef5;margin-top: 5px;width: 750px;margin-left: 600px"></div>
      </div>
    </div>
    <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="projectData.total"
        :pager-count="navSize"
        class="mt-4"
        v-model:current-page="currentPage"
        @current-change="search"
        style="margin-top: 20px;justify-content: center;"></el-pagination>
  </div>
</template>

<script>
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {get, post} from "@/request/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {projectStore} from "@/store/projectStore";
import {userStore} from "@/store/userStore";
import router from "@/router/router";

export default {
  name: "ProjectManagement",
  setup(){
    const {proxy}=getCurrentInstance();
    const httpUrl=proxy.$key
    const pageSize=5
    const navSize=5
    let currentPage=ref(1)
    let searchValue=ref("")
    let searchValueForRecord=ref("")
    const projectData=ref(0)
    let userStoreVar=userStore()
    const dialogFormVisible=ref(false)
    const ruleFormRef = ref('')
    const formLabelWidth='140px'
    const projectStoreVar=projectStore()
    const recordData=ref([])
    const recordData2=ref([])
    const dialogTableVisible = ref(false)
    const dateChoice = ref('')
    const timeInfo = reactive({
      setInterval: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
    });
    function setNowTimes() {
      let myDate = new Date();
      let wk = myDate.getDay();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(
          myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      );
      let hou = String(
          myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
          myDate.getMinutes() < 10
              ? "0" + myDate.getMinutes()
              : myDate.getMinutes()
      );
      let sec = String(
          myDate.getSeconds() < 10
              ? "0" + myDate.getSeconds()
              : myDate.getSeconds()
      );
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let week = weeks[wk];
      timeInfo.nowDate = yy + "-" + mm + "-" + dd + "";
      timeInfo.nowTime = hou + ":" + min + ":" + sec + ""
      timeInfo.nowWeek = week;
    }
    const form = reactive({
      id:'',
      name: '',
      category: '',
      remark: '',
    })
    onMounted(async () => {
      await primarySearch()
      timeInfo.setInterval = setInterval(() => {
        timeInfo.value = setNowTimes();
      }, 1000);
    })
    const search=async () => {
      const {data} = await get(httpUrl+"/project/getPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        projectName: searchValue.value,
        category: searchValue.value,
        remark: searchValue.value
      })
      projectData.value = data
    }
    const primarySearch=async () => {
      {
        const {data} = await get(httpUrl + "/project/getPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          navSize: navSize,
          projectName: searchValue.value,
          category: searchValue.value,
          remark: searchValue.value
        })
        projectData.value = data
      }
      {
        const {data} = await get(httpUrl + "/record/getFirstFive", {})
        recordData.value = data
      }
    }
    const reset=()=>{
      searchValue.value=""
      primarySearch()
    }
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          const {code} = await post(httpUrl+"/project/update", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
            await primarySearch()
          } else {
            ElMessage({
              message: '操作失败',
              type: 'error',
            })
          }
        } else {
          ElMessage({
            message: '操作失败',
            type: 'error',
          })
          return false
        }
      })
    }
    const resetForm=()=>{
      form.id=''
      form.name=''
      form.category=''
      form.remark=''
    }
    const rules = reactive({
      name: [{ required: true,message: "请输入项目名称", trigger: 'blur' }],
      category: [{ required: true,message: "请输入项目分类", trigger: 'blur' }],
      remark: [{ required: true,message: "请输入项目备注", trigger: 'blur' }],
    })
    const handleEdit = (row) => {
      dialogFormVisible.value=true
      form.id=row.id
      form.name=row.name
      form.category=row.category
      form.remark=row.remark
    }
    const handleDelete = async (row) => {
      ElMessageBox.confirm(
          '您确定要删除该项目吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl+"/project/delete", {id:row.id})
        if (code === 200) {
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '删除失败',
            type: 'error',
          })
        }
        await primarySearch()
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
    }
    const jump=(item)=>{
      projectStoreVar.project.id=item.id
      projectStoreVar.project.name=item.name
      projectStoreVar.project.category=item.category
      projectStoreVar.project.remark=item.remark
      projectStoreVar.project.userId=item.userId
    }
    const more=async () => {
      dialogTableVisible.value = true
      const {data} = await get(httpUrl+"/record/getRecords", {})
      recordData2.value = data
    }
    const searchForRecord=async () => {
      if(dateChoice.value.length===0){
        const {code,data} = await get(httpUrl + "/record/getRecords", {
          keyword: searchValueForRecord.value,
        })
        if(code===200){
          recordData2.value=data
        }else{
          ElMessage({
            message: '查询失败',
            type: 'error',
          })
        }
      }else{
        const {code,data} = await get(httpUrl + "/record/getRecords", {
          keyword: searchValueForRecord.value,
          startTime: dateChoice.value[0],
          endTime: dateChoice.value[1],
        })
        if(code===200){
          recordData2.value=data
        }else{
          ElMessage({
            message: '查询失败',
            type: 'error',
          })
        }
      }
    }
    const resetForRecord=()=>{
      searchValueForRecord.value=""
      more()
    }
    const recordClose=()=>{
      dialogTableVisible.value=false
      dateChoice.value=""
      recordData2.value=[]
    }
    const handleDeleteForRecord = (row)=>{
      ElMessageBox.confirm(
          '您确定要删除该记录吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl+"/record/delete", {id:row.id})
        if (code === 200) {
          ElMessage({
            message: '删除成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '删除失败',
            type: 'error',
          })
        }
        await more()
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
    }
    const add = async () => {
      await router.push({path: '/index/AddCase'})
    }
    return{
      searchValue,
      search,
      reset,
      currentPage,
      dialogFormVisible,
      ruleFormRef,
      formLabelWidth,
      form,
      submit,
      resetForm,
      rules,
      projectData,
      handleEdit,
      handleDelete,
      pageSize,
      navSize,
      jump,
      httpUrl,
      userStoreVar,
      timeInfo,
      recordData,
      more,
      dialogTableVisible,
      recordData2,
      dateChoice,
      searchValueForRecord,
      searchForRecord,
      resetForRecord,
      handleDeleteForRecord,
      recordClose,
      add
    }
  }
}
</script>

<style scoped>
.text {
  resize: none;
  width: 730px;
  height: 40px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  border: none;
  outline: none;
  transition: all 0.5s;
  font-family: Bahnschrift,serif;
}
.projectItem{
  width: 730px;
  height: 100px;
  /*border: 1px solid #ebeef5;*/
  border-radius: 5px;
  margin-left: 600px;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 10px;
}
.projectItem:hover{
  /*box-shadow: 0 0 10px rgba(0,0,0,0.2);*/
  /*transition: all 0.5s;*/
  cursor: pointer;
}
.text:hover{
  cursor: pointer;
}
.moreLink{
  color: #409EFF;
  font-size: 16px;
  margin-left: 0;
  margin-bottom: 10px;
  margin-top: 10px;
  cursor: pointer;
}
</style>
