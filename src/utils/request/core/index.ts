import { randomKey } from './utils'

/**
 * @description 请求拦截器
 */
type IRequestInterceptor<T> = (options: IHttpConfig<T>) => IHttpConfig<T> | Promise<IHttpConfig<T>>

/**
 * @description 响应拦截器
 */
type IResponseInterceptor = (response: any) => any | Promise<any>

/**
 * @description 整个类 初始化时候的 config
 */
interface IHttpRequestConfig<T> {
  requestInterceptors?: Array<IRequestInterceptor<T>>
  responseInterceptors?: Array<IResponseInterceptor>
}

/**
 * @description 请求传进来的 入参
 */
interface IHttpOptions<T> {
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS'
  url: string
  data?: object
  customPayload?: T
}

/**
 * @description 请求的confiig
 */
interface IHttpConfig<T> {
  taskId: string
  options: IHttpOptions<T>
  instance: HttpRequest
}

/**
 * GenerateHttpRequestTypes 暴露出去，可以生成所有需要的类型
 */
export interface GenerateHttpRequestTypes<ICustomPayload = object> {
  IHttpRequestConfig: IHttpRequestConfig<ICustomPayload>
  IHttpOptions: IHttpOptions<ICustomPayload>
  IHttpConfig: IHttpConfig<ICustomPayload>
  IRequestInterceptor: IRequestInterceptor<ICustomPayload>
  IResponseInterceptor: IResponseInterceptor
}

/**
 *
 */
class HttpRequest<HttpRequestTypes extends GenerateHttpRequestTypes = GenerateHttpRequestTypes> {
  static _instance

  request: (options: HttpRequestTypes['IHttpConfig']) => Promise<unknown>
  config: HttpRequestTypes['IHttpRequestConfig']
  taskCaches: HttpRequestTypes['IHttpConfig'][] = [] // 任务缓存

  constructor(
    request: (config: HttpRequestTypes['IHttpConfig']) => Promise<unknown>, //
    config: HttpRequestTypes['IHttpRequestConfig']
  ) {
    if (new.target !== HttpRequest) {
      return
    }
    if (!HttpRequest._instance) {
      // 创建
      this.request = request
      this.config = config
      // 创建 end
      HttpRequest._instance = this
    }
    return HttpRequest._instance
  }

  // 请求方法
  // @ts-ignore
  async http({ method = 'POST', url, customPayload = {}, ...restOptions }: HttpRequestTypes['IHttpOptions']) {
    const options = {
      method,
      url,
      customPayload,
      ...restOptions,
    }
    const taskId = randomKey() + new Date().getTime() // 这一次请求的taskId
    const config: HttpRequestTypes['IHttpConfig'] = {
      taskId,
      options,
      instance: this,
    }
    const finalConfig = (await executeInterceptors(this.config.requestInterceptors ?? [])(config)) as HttpRequestTypes['IHttpConfig'] // 请求拦截器 处理过的options

    // 加入taskCaches
    const taskItem: HttpRequestTypes['IHttpConfig'] = {
      ...finalConfig,
    }
    this.taskCaches.push(taskItem)

    return this.request(finalConfig).then(async (response) => {
      const index = this.taskCaches.findIndex((item) => item.taskId == taskId)
      if (index > -1) {
        // 执行响应拦截器
        const data = await executeInterceptors([
          // 默认的 响应拦截器
          (response) => {
            // 1. taskCaches 剔除任务
            this.taskCaches.splice(index, 1)
            return { ...response, instance: this } // 2. 加上 instance
          },
          ...(this.config.responseInterceptors ?? []),
        ])(response)
        return data
      }
    })
  }

  /**
   * 取消请求
   * 其实并不是真正的axios取消请求，只是这个请求回来之后 不做响应
   * @example
   * instance.abort('id1')
   * instance.abort('id2', 'id2')
   * instance.abort(['id2', 'id2'])
   * instance.abort('ALL')
   */
  abort(...args: [string] | string[] | [string[]] | ['ALL']) {
    let abortIdArr: string[] = []
    if (args.length == 1) {
      // [string]  [string[]]  ['ALL']
      const param = args[0]
      if (typeof param == 'string') {
        if (param === 'ALL') {
          abortIdArr = this.taskCaches.map((item) => item.taskId)
        } else {
          abortIdArr = [param]
        }
      } else if (typeof param == 'object') {
        // [string[]]
        abortIdArr = param
      }
    } else {
      // string[]
      abortIdArr = args as string[]
    }
    // 更新 taskCaches
    this.taskCaches = this.taskCaches.filter((item) => !abortIdArr.includes(item.taskId))
  }
}

// 连续执行方法
function executeInterceptors(funcArr) {
  const [firstFunc, ...restFuncArr] = funcArr // 第一个执行的函数
  return (...args) => {
    return restFuncArr?.reduce((promise, func) => {
      return promise.then((...resultArgs) => {
        return func.apply(null, resultArgs)
      })
    }, Promise.resolve(firstFunc?.apply(null, args)))
  }
}

export default HttpRequest
export { HttpRequest }

///
