<template>
  <div class="ModifyCase">
    <div>
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
      <el-select v-model="project" class="m-2" placeholder="请选择所属项目">
        <el-option
            v-for="(item,index) in projectData"
            :key="index"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <el-button @click="search" type="success" style="margin-left: 10px">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
      <el-button @click="dialogFormVisible = true;" type="primary">新增</el-button>
      <el-dialog v-model="dialogFormVisible" title="新增案例资料" width="500px">
        <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="资料名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="所属项目" :label-width="formLabelWidth" prop="projectId">
            <el-select v-model="form.projectId" class="m-2" placeholder="请选择所属项目">
              <el-option
                  v-for="(item,index) in projectData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资料文件" :label-width="formLabelWidth" prop="file">
            <input id="materialFile" type="file"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
             <el-button type="primary" @click="submit(ruleFormRef)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-table :data="materialData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="资料Id" width="220px"/>
      <el-table-column prop="name" label="资料名称"/>
      <el-table-column prop="projectName" label="资料所属项目"/>
      <el-table-column label="资料所属用户">{{userStoreVar.user.userName}}</el-table-column>
      <el-table-column fixed="right" label="操作" width="220px">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleView(scope.row)">查看</el-button>
          <el-button type="primary" size="small" @click="handleDownload(scope.row)">下载</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="materialData.total"
        :pager-count="navSize"
        class="mt-4"
        v-model:current-page="currentPage"
        @current-change="search"
        style="margin-top: 10px;justify-content: center;"
    />
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import {get} from "@/request/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {userStore} from "@/store/userStore";
import axios from '@/request/http'
import {documentStore} from "@/store/documentStore";
import router from "@/router/router";

export default {
  name: "UploadMaterial",
  setup(){
    const httpUrl='http://www.diandianjun.com.cn:8070'
    const pageSize=10
    const navSize=5
    let currentPage=ref(1)
    let searchValue=ref("")
    const materialData=ref(0)
    const projectData=ref(0)
    const dialogFormVisible=ref(false)
    const ruleFormRef = ref('')
    const project=ref()
    const formLabelWidth='140px'
    const userStoreVar=userStore()
    const documentStoreVar=documentStore()
    const form = reactive({
      name: '',
      projectId: '',
      file: '',
    })
    onMounted(async () => {
      await primarySearch()
    })
    const search=async () => {
      const {data} = await get(httpUrl+"/material/getPaged", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        materialName:searchValue.value,
        projectName:searchValue.value,
        projectId:project.value
      })
      materialData.value = data
    }
    const primarySearch=async () => {
      {
        const {data} = await get(httpUrl + "/material/getPaged", {
          pageSize: pageSize,
          pageNum: currentPage.value,
          navSize: navSize,
        })
        materialData.value = data
      }
      {
        const {data} = await get(httpUrl + "/project/getAll", {

        })
        projectData.value = data
      }
    }
    const reset=()=>{
      searchValue.value=""
      project.value=""
      primarySearch()
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
        const {code} = await get(httpUrl+"/material/delete", {id:row.id})
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
    const handleView=(row)=>{
      axios({
        url: httpUrl+"/material/getContent",
        method: 'get',
        responseType: 'arraybuffer',
        params:{
          location:row.location
        }
      }).then(async res => {
        const blob = new Blob([res.data]);
        documentStoreVar.construct(blob)
        await router.push({path: "/index/documentPreview"})
      })
    }
    const handleDownload=async (row) => {
      // let getForm=document.getElementById("getForm")
      // getForm.setAttribute("action",httpUrl+"/material/getDownload")
      // let input=document.getElementById("fileLocation")
      // input.value=row.location
      // let submit = document.getElementById("formSubmit")
      // submit.click()
      axios({
        url: httpUrl+"/material/getDownload2",
        method: 'get',
        responseType: 'arraybuffer',
        params:{
          location:row.location
        }
      }).then(res => {
        const blob = new Blob([res.data]);
        //创建一个<a></a>标签
        let a = document.createElement("a");
        // 将流文件写入a标签的href属性值
        a.href = URL.createObjectURL(blob);
        //设置文件名
        const str = row.location.split("/");
        a.download = str[str.length - 1]
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
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          let formData = new FormData()
          const materialFile = document.querySelector("#materialFile");
          if(!materialFile.files.length){
            ElMessage({
              message: '请选择文件',
              type: 'error',
            })
            return
          }
          const file = materialFile.files[0]
          formData.append('file', file)
          formData.append('name',form.name)
          formData.append('projectId',form.projectId)
          const {data} = await axios.post(httpUrl + "/material/add",formData , {
            'Content-Type':'multipart/form-data'
          })
          const code=data.code
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
    const rules = reactive({
      name: [{required: true, message: "请输入名称", trigger: 'blur'}],
      projectId: [{required: true, message: "请选择项目", trigger: 'blur'}],
    })
    return{
      searchValue,
      search,
      reset,
      currentPage,
      dialogFormVisible,
      ruleFormRef,
      formLabelWidth,
      form,
      materialData,
      handleDelete,
      pageSize,
      navSize,
      handleView,
      userStoreVar,
      projectData,
      project,
      httpUrl,
      submit,
      rules,
      handleDownload,
    }
  }
}
</script>

<style scoped>

</style>
