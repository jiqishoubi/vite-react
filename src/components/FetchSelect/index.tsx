import request from '@/utils/request'
import { Select } from 'antd'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'

const { Option } = Select

/**
 * @param { object } props
 * @param { string } props.api 请求接口
 * @param { object } props.formData 携带参数
 * @param { string } [props.valueKey='codeParam']
 * @param { string } [props.textKey='codeValue']
 * @param { string } [props.placeholder='请选择']
 * @param { (data:any)=>any[] } props.dealResFunc 处理返回的data 返回数组
 * @param { (formData: object) => boolean } props.getReady 如果它存在，那么只有那当它返回true的时候 才去请求
 */

const Index = (props) => {
  const { value, disabled, api, formData = {}, valueKey = 'codeKey', textKey = 'codeValue', placeholder = '请选择', dealResFunc, getReady, ...restProps } = props
  const [optionArr, setOptionArr] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    debounceFn(getOptions)
  }, [JSON.stringify(formData)])

  const getOptions = () => {
    if (getReady && !getReady(formData)) return

    setLoading(true)
    request
      .http({
        url: api,
        data: {
          ...formData,
        },
      })
      .finally(() => setLoading(false))
      .then((data) => {
        console.log('🚀 ~ data', data)
        let arr = []
        if (dealResFunc) {
          arr = dealResFunc(data ?? [])
        } else {
          arr = data ?? []
        }
        setOptionArr(arr)
      })
      .catch(() => {
        setOptionArr([])
      })
  }

  const debounceFn = useCallback(
    debounce((callback) => callback(), 700),
    []
  )

  const onSelectChange = (code) => {
    if (props.onChange) {
      const isArray = Array.isArray(code)
      if (isArray) {
        let selectedOption = []
        code.map((r) => {
          // selectedOption.push(optionArr.find((itm) => itm[valueKey] == r))
        })
        props.onChange(code, selectedOption || undefined)
      } else {
        const selectedOption = optionArr.find((itm) => itm[valueKey] == code)
        props.onChange(code, selectedOption || undefined)
      }
    }
  }

  return (
    <Select
      placeholder={placeholder}
      style={{
        width: '100%',
        ...(props.style ?? {}),
      }}
      loading={loading}
      allowClear
      disabled={disabled}
      {...restProps}
      value={value}
      onChange={onSelectChange}
    >
      {optionArr &&
        Array.isArray(optionArr) &&
        optionArr.map((obj, index) => {
          return (
            <Option key={obj['templateData'] || index} value={obj[valueKey]}>
              {obj[textKey]}
            </Option>
          )
        })}
    </Select>
  )
}

export default Index
