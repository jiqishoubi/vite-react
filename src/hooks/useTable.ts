import { IColumn, ITableProps } from '@/components/Table'
import { useState, useEffect, useMemo, useRef } from 'react'

export interface IUseTableOptions {
  tableId?: string
  columns: IColumn[]
  defaultColumnWidth?: number
  ajax: (pageState: { page: number; pageSize: number }) => Promise<{ list: any[]; total: number }>
  defaultPageSize?: number
  initLoad?: boolean
}
export interface IUseTableReturn {
  tableProps: { columns: IColumn[] } & { [Property in keyof ITableProps]: ITableProps[Property] }
  setTableData: (data: any[]) => void
  search: any
  refresh: any
}

function useTableWidth(showTableId: string, columns: IColumn[], defaultColumnWidth: number) {
  // 表格宽度
  const [rawTableWidth, setRawTableWidth] = useState(0)

  useEffect(() => {
    const tableDom = document.getElementById(showTableId)
    if (tableDom) {
      setRawTableWidth(tableDom.clientWidth)
    }
  }, [])

  const tableWidth = useMemo(() => {
    if (rawTableWidth && Array.isArray(columns) && columns.length > 0) {
      const allColumnsWidth = columns.reduce((alc, column) => {
        return alc + (column.width || defaultColumnWidth)
      }, 0)
      if (allColumnsWidth > rawTableWidth) {
        return allColumnsWidth
      }
    }
    return undefined
  }, [rawTableWidth, JSON.stringify(columns)])
  return tableWidth
}

export default function useTable({
  tableId: setTableId,
  columns,
  defaultColumnWidth = 180,
  ajax,
  defaultPageSize = 20,
  initLoad = true, // 初始是否加载
}: IUseTableOptions): IUseTableReturn {
  const showTableId = setTableId || `_${window.location.pathname}_table`
  // 表格
  const [page, setPage] = useState(1) //当前的页码
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [tableData, setTableData] = useState<any[]>([]) //表格的数据
  const [tableTotal, setTableTotal] = useState(0) //表格数据总量
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [isListenPage, setIsListenPage] = useState(initLoad)
  const tableWidth = useTableWidth(showTableId, columns, defaultColumnWidth)

  function onTableChange({ page, pageSize }) {
    setPage(page)
    setPageSize(pageSize)
  }

  function getData() {
    setIsTableLoading(true)
    return ajax({
      page,
      pageSize,
    })
      .finally(() => {
        setIsTableLoading(false)
        setIsListenPage(true)
      })
      .then(({ list, total }) => {
        setTableData(list ?? [])
        setTableTotal(total ?? 0)
      })
  }

  useEffect(() => {
    if (isListenPage) {
      getData()
    }
  }, [page, pageSize])

  // 方法
  function search() {
    if (page == 1) {
      refresh()
    } else {
      setPage(1)
    }
  }
  function refresh() {
    getData()
  }

  return {
    tableProps: {
      tableId: showTableId,
      tableWidth,
      columns,
      page,
      pageSize,
      data: tableData,
      total: tableTotal,
      loading: isTableLoading,
      onChange: onTableChange,
    },
    //方法
    setTableData, // 静态手动修改tableData
    search, // 刷新表格 页码变成1
    refresh, // 刷新表格 页码不变
  }
}
