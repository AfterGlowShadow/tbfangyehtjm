import Vue from 'vue'
import axios from 'axios'
import baseurl from './config'
import router from '../../router'
// 在vue原型中添加$http方法等于axios
Vue.prototype.$http = axios;
window.HOST = baseurl;
window.axios = axios;

Vue.prototype.$imgurl = baseurl;
// import {apis} from './config.js'
// 假设 api里定义了一个请求头类型
const isFrom = true
const headers = isFrom ? {'Content-Type': 'application/x-www-form-urlencoded'} : {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
// axios实例
const instance = Vue.prototype.$http.create({
  // apis,
  // headers,
  timeout: 200000,
})

/**
 * get 请求数据进行修改  默认以对象形式传参
 */
function getDataConfig(data = {}) {
  if (typeof data !== 'object') return data
  const arr = []
  for (let key in data) {
    let res = `${key}=${data[key]}`
    arr.push(res)
  }
  const str = arr.join('&')
  return '?' + str
}

/**
 * 请求数据拦截
 */
instance.interceptors.request.use(config => {
  // isForm &&
  if (config.method === 'post'){
    config.data =config.request
    // config.data = qs.stringify(config.request)
    // config.data = qs.parse(config.request)
  }
  // 此处应该行不通
  // if (config.method === 'get') config.data = getDataConfig(config.data)
  return config
}, error => {
  return Promise.reject(error)
});
/**
 * 响应数据拦截
 */
instance.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
});
const fetchs = {
  post(url, request,isForm, status = '200') {
    return new Promise((resolve, reject) => {
      instance({
        method: 'post',
        url: baseurl + url,
        request,
        headers:{
          'Content-Type': isForm===1?'application/x-www-form-urlencoded;charset=utf-8':'application/json;charset=utf-8',
          "Authorization":sessionStorage.getItem("accessToken") ?sessionStorage.getItem("accessToken"):''
        }
      }).then(response => {
        if (response && response.code === status) {
          resolve(response)
        }else if(response && response.code === 11001){
          Vue.prototype.$alert('请先登录', '温馨提示', {
            confirmButtonText: '确定',
            callback: action => {
              router.push('/login');
            }
          })
        }else{
          resolve(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  get(url, request, status = '200') {
    const data = getDataConfig(request)
    return new Promise((resolve, reject) => {
      instance({
        method: 'get',
        url: baseurl + url + data,
        headers:{
          "Authorization":sessionStorage.getItem("accessToken") ?sessionStorage.getItem("accessToken"):''
        }
      }).then(response => {
        // const res = response.data ? response.data : response.pageData
        if (response && response.code === status) {
          resolve(response)
        }else {
          resolve(response)
        }
        // reject(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default fetchs
