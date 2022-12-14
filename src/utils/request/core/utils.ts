/**
 * @description 将funcArr封装成一个可以序列执行的函数 支持promise
 * @param {Array<Function>} funcArr
 */
export const composePromise = (funcArr) => {
  const [firstFunc, ...restFuncArr] = funcArr // 第一个执行的函数

  return (...args) => {
    return restFuncArr?.reduce((promise, func) => {
      return promise.then((result) => {
        return func.call(null, result)
      })
    }, Promise.resolve(firstFunc?.apply(null, args)))
  }
}

//生成一个随机key
export const randomKey = (subNum?) => {
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let temp = ''
  for (let i = 0; i < 7; i++) {
    let index = Math.ceil(Math.random() * (str.length - 1))
    let a = str.split('')[index]
    temp = temp + a
  }
  temp = temp + new Date().getTime().toString()

  if (subNum) {
    return temp.substring(0, subNum)
  }
  return temp
}
