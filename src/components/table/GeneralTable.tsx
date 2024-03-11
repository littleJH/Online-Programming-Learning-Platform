import React from 'react'
import { Table, Button, Popconfirm, Skeleton } from 'antd'
import { getPagination } from '@/config/config'
import { ColumnGroupType, ColumnsType, TableProps } from 'antd/es/table'
export interface GeneralTableProps {
  dataSource: any
  columns: any[]
  pageProps?: {
    pageNum: number
    pageSize: number
    total: number
    onPageChange: Function
  }
  loading?: boolean
  scroll?: TableProps<any>['scroll']
  rowSelection?: TableProps<any>['rowSelection']
  onRow?: any
  actions?: any[]
  size?: 'large' | 'middle' | 'small'
  bordered?: boolean
  style?: React.CSSProperties
  emptyText?: React.ReactNode
}

const GeneralTable: React.FC<GeneralTableProps> = (props) => {
  const {
    loading = undefined,
    dataSource,
    bordered = false,
    pageProps,
    size = 'small',
    columns = [],
    scroll,
    rowSelection,
    onRow,
    actions,
    style,
    emptyText,
  } = props

  const columns_copy = columns.map((column) => {
    return {
      ...column,
      title: <div style={{ fontWeight: 500 }}>{column.title}</div>,
    }
  })

  return (
    <div>
      <Table
        style={style}
        scroll={scroll}
        rowSelection={rowSelection}
        onRow={onRow}
        size={size}
        loading={loading}
        dataSource={dataSource}
        columns={actions ? [...columns_copy, ...actions] : columns_copy}
        bordered={bordered}
        locale={{
          emptyText: emptyText,
        }}
        pagination={
          pageProps
            ? getPagination('table', pageProps?.pageNum, pageProps?.pageSize, pageProps?.total, pageProps?.onPageChange)
            : false
        }
      ></Table>
    </div>
  )
}

export default GeneralTable
