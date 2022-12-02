import axios, { AxiosRequestConfig } from 'axios'
import './interceptors'

interface IRequestOptions {
  method?: 'get' | 'post'
  url: string
  data?: object
  headers?: object
}

function request<T = any>({ method = 'post', url, data = {}, headers = {} }: IRequestOptions): Promise<T> {
  return axios({
    method,
    url,
    data,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
      ...headers,
    },
  })
}
export default request
