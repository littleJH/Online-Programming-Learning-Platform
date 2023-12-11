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
}

const GeneralTable: React.FC<GeneralTableProps> = props => {
  const {
    loading = undefined,
    dataSource,
    bordered = false,
    pageProps,
    columns = [],
    size = 'small',
    scroll,
    rowSelection,
    onRow,
    actions,
    style,
  } = props

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
        columns={actions ? { ...columns, ...actions } : columns}
        bordered={bordered}
        pagination={
          pageProps
            ? getPagination(
                'table',
                pageProps.pageNum,
                pageProps.pageSize,
                pageProps.total,
                pageProps.onPageChange,
              )
            : undefined
        }></Table>
    </div>
  )
}

export default GeneralTable
