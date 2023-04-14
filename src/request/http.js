// http request 拦截器
import axios from "axios";
import {userStore} from "@/store/userStore";

axios.interceptors.request.use(
    config => {
        if (userStore().user.token!=='') {
            config.headers.Authorization = `${userStore().user.token}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    },
)
export default axios
