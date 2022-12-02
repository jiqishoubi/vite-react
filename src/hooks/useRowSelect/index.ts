import { IRowSelection } from '@/components/Table'
import { useMemo, useState } from 'react'
import BatchBar from './BatchBar'

export interface IUseRowSelectOptions {
  rowKey?: string
  data: any[] // 当前表格的数据 tableData
}

export interface IUseRowSelectReturn {
  selectedRows?: any[]
  selectedRowKeys?: (string | number)[]
  setSelectedRows?: (arr: any[]) => void
  rowSelectionProps: IRowSelection
}

export default function ({ rowKey = 'id', data }: IUseRowSelectOptions) {
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const selectedRowKeys = selectedRows.map((item) => item[rowKey])

  // 更新批量选择
  const updateSelectedRows = (selected, rows) => {
    let selectedRowsTemp = selectedRows
    let selectedRowsTempNew: any[] = []

    if (selected) {
      //增加
      selectedRowsTemp = [...selectedRowsTemp, ...rows]
      const res = new Map()
      selectedRowsTempNew = selectedRowsTemp.filter((item) => !res.has(item[rowKey]) && res.set(item[rowKey], 1))
    } else {
      //删除
      selectedRowsTempNew = selectedRowsTemp.filter((item) => {
        let filterArr = rows.filter((obj) => obj[rowKey] == item[rowKey])
        return !filterArr[0]
      })
    }

    setSelectedRows(selectedRowsTempNew)
  }

  function onSelectAll(flag) {
    updateSelectedRows(flag, data)
  }
  function onSelectRow(flag, record) {
    updateSelectedRows(flag, [record])
  }

  // 勾选状态
  function getRowChecked(record) {
    return selectedRowKeys.includes(record[rowKey])
  }
  const allCheckedProps = useMemo(() => {
    let indeterminate = false
    let checked = false
    if (Array.isArray(data) && data.length > 0) {
      indeterminate = selectedRowKeys.some((key) => data.some((record) => record[rowKey] == key)) && selectedRowKeys.some((key) => data.some((record) => record[rowKey] != key))
      checked = data.every((record) => selectedRowKeys.includes(record[rowKey]))
    }
    return {
      indeterminate: checked ? false : indeterminate,
      checked,
    }
  }, [selectedRowKeys, data])

  return {
    selectedRows,
    selectedRowKeys,
    setSelectedRows,
    rowSelectionProps: {
      onSelectAll,
      onSelectRow,
      // 勾选状态
      getRowChecked,
      allCheckedProps,
    },
  }
}
export { BatchBar }
