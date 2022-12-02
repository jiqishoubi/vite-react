/**
 * @description 用aa替换汉字 并返回
 * @param { string } value
 */
export const wordLengthTrans = (value) => {
  return value ? value.replace(/[\u4e00-\u9fa5|，|。]/g, 'aa') : ''
}

// 判断类型
type IVarType = 'Object' | 'Array' | 'String' | 'Number' | 'Boolean' | 'Null' | 'Undefined'
export function getVarType(o: any): IVarType {
  const typeStr = Object.prototype.toString.call(o) // `[object Object]`
  return typeStr?.split(' ')?.[1]?.split(']')?.[0] as IVarType
}

// 生成随机字符串
export const randomStrKey = (num = 7) => {
  // num 位数，默认7
  return Math.random().toString(36).substr(2, num)
}

export function tryJSONParse(jsonStr, defaultValue = {}) {
  let jsonObj = defaultValue
  try {
    const o = JSON.parse(jsonStr)
    if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(o))) {
      jsonObj = o
    }
  } catch (err) {}
  return jsonObj
}

// tree扁平化
export function treeToList(tree, childrenKey = 'routes') {
  let arr: any[] = []

  tree.forEach((item) => {
    if (item[childrenKey] && item[childrenKey].length > 0) {
      arr = [...arr, ...treeToList(item[childrenKey])]
    } else {
      arr.push(item)
    }
  })

  return arr
}
