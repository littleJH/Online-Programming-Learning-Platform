import React from 'react'
import { Table, Button, Popconfirm, Skeleton } from 'antd'
import { getPagination } from '@/config/config'
import { ColumnGroupType, ColumnsType } from 'antd/es/table'

interface Iprops {
  loading: boolean
  dataSource: any
  columns: any[]
  itemRender: Function
  pageNum: number
  pageSize: number
  total: number
  onPageChange: Function
  onDelete?: Function
  onDetail?: Function
  onUpdate?: Function
  bordered?: boolean
}

const GeneralTable: React.FC<Iprops> = props => {
  const {
    loading,
    dataSource,
    onDelete,
    onDetail,
    onUpdate,
    itemRender,
    bordered,
    pageNum,
    pageSize,
    total,
    onPageChange,
    columns,
  } = props

  return (
    <div>
      <Table
        size="small"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={getPagination(
          'table',
          pageNum,
          pageSize,
          total,
          onPageChange,
        )}
      ></Table>
    </div>
  )
}

export default GeneralTable
