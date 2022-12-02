import axios from 'axios'
import { host } from '@/utils/consts'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    // token
    const token = 'LSIDC4302045A71F137E6B913759D9392428' // 测试

    // url
    let url = config?.url || ''
    if (url?.indexOf('http:') > -1 || url?.indexOf('https:') > -1) {
    } else {
      // 加host
      url = host + url
    }

    // postData
    let postData = { token, ...config.data }
    for (let key in postData) {
      if (postData.hasOwnProperty(key)) {
        const value = postData[key]
        if (value === null || value === undefined || value === 'null' || value === 'undefined') {
          delete postData[key]
        }
      }
    }

    return { ...config, url, data: postData }
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    if (response.status == 200) {
      const res = response.data
      if (res.code == 200) {
        return res.data
      } else {
        // 业务失败
        return Promise.reject(res)
      }
    } else {
      return Promise.reject(response)
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
