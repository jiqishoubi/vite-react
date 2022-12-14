import request from '@/utils/request'
import { Select, SelectProps } from 'antd'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const { Option } = Select

export interface IFetchSelectProps extends SelectProps {
  value?: string | number | (string | number)[]
  onChange?: (e?: string | number | (string | number)[], selected?: object | object[]) => void
  api: string
  formData?: object
  valueKey?: string
  textKey?: string
  dealResFunc?: (data: any) => any[]
  getReady?: (formData: object) => boolean // 如果getReady存在，那么只有那当它返回true的时候 才去请求
}

/**
 *
 */
const FetchSelect: React.FC<IFetchSelectProps> = (props) => {
  const { value, api, formData = {}, valueKey = 'codeParam', textKey = 'codeValue', dealResFunc, getReady, ...restProps } = props
  const [optionArr, setOptionArr] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const showValue = useMemo(() => {
    if (!value) return undefined
    if (restProps.mode == 'multiple') {
      const codes = (value as string).split(',')
      return codes.map((code) => {
        return optionArr.find((item) => item[valueKey] == code)?.[valueKey] // 这里要用 == 因为code 有可能是number，转成逗号分隔的字符串之后，就变成string了
      })
    } else {
      return value
    }
  }, [value, optionArr, restProps.mode])

  useEffect(() => {
    debounceFn(getOptions)
  }, [JSON.stringify(formData)])

  const getOptions = () => {
    if (getReady && !getReady(formData)) return
    setLoading(true)
    request
      .http({
        url: api,
        data: formData,
      })
      .finally(() => setLoading(false))
      .then((data) => {
        let arr: any[] = []
        if (dealResFunc) {
          arr = dealResFunc(data ?? [])
        } else {
          arr = data ?? []
        }
        setOptionArr(arr)
      })
      .catch(() => setOptionArr([]))
  }

  const debounceFn = useCallback(
    debounce((callback) => callback(), 700),
    []
  )

  // 触发onChange
  const onSelectChange = (e) => {
    if (props.onChange) {
      if (restProps.mode == 'multiple') {
        // 多选
        let selectedOptions: any[] = []
        const codes = e as (number | string)[]
        codes.map((code) => {
          const selectedOption = optionArr.find((item) => item[valueKey] == code)
          if (selectedOption) selectedOptions.push(selectedOption)
        })
        const codeStr = codes.join(',')
        props.onChange(codeStr, selectedOptions) // 逗号分隔的code
      } else {
        // 单选
        const code = e
        const selectedOption = optionArr.find((item) => item[valueKey] == code)
        props.onChange(code, selectedOption)
      }
    }
  }

  return (
    <Select placeholder="请选择" {...restProps} allowClear loading={loading} value={showValue} onChange={onSelectChange} style={{ width: '100%', ...restProps.style }}>
      {optionArr &&
        Array.isArray(optionArr) &&
        optionArr.map((item, index) => {
          return (
            <Option key={item[valueKey] || index} value={item[valueKey]}>
              {item[textKey]}
            </Option>
          )
        })}
    </Select>
  )
}

export default FetchSelect
