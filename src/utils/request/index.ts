import axios from 'axios'
import HttpRequest, { GenerateHttpRequestTypes } from './core'

interface ICustomPayload {
  isNeedToken?: boolean
}
type HttpRequestTypes = GenerateHttpRequestTypes<ICustomPayload>

// 请求拦截器
const requestInterceptor: HttpRequestTypes['IRequestInterceptor'] = (config) => {
  const { options } = config
  // console.log('🚀 ~ options', options)
  // // host
  // let url = globalHost() + options.url
  // // token
  // const token = getToken()
  // if (token) url = url + `?token=${token}`

  return config
  // return {
  //   ...config,
  //   options: {
  //     ...options,
  //     url,
  //   },
  // }
}

// 响应拦截器
const responseInterceptor: HttpRequestTypes['IResponseInterceptor'] = (response) => {
  return new Promise((resolve, reject) => {
    if (response.status == 200) {
      const res = response.data
      if (res.code == '0') {
        return resolve(res.data)
      } else {
        return reject(res)
      }
    }
  })
}

const request = new HttpRequest<HttpRequestTypes>(
  (config) => {
    return new Promise((resolve) => {
      axios({
        method: config.options.method,
        url: config.options.url,
        data: config.options.data,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
        .then((response) => {
          return resolve(response)
        })
        .catch((err) => {
          return resolve(err)
        })
    })
  },
  { requestInterceptors: [requestInterceptor], responseInterceptors: [responseInterceptor] }
)

export default request
