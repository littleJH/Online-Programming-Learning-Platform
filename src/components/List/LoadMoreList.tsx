import React, { useEffect, useState, useRef } from 'react'
import { List, Button, Popconfirm, Skeleton } from 'antd'
import useListenContentScroll from '@/tool/myHooks/useListenScroll'
import Loading from '../Loading/Loading'

interface Iprops {
  dataSource: any
  itemRender: Function
  fetchFn: (pageNum: number, pageSize: number, setLoading: Function, callback: () => void) => void
  onDelete?: Function
  onDetail?: Function
  onUpdate?: Function
  bordered?: boolean
  split?: boolean
}

const LoadMoreList: React.FC<Iprops> = (props) => {
  const { dataSource, onDelete, onDetail, onUpdate, itemRender, bordered, split = true, fetchFn } = props
  const [loading, setLoading] = useState(false)
  const pageNum = useRef<number>(1)
  const pageSize = useRef<number>(10)

  useEffect(() => fetchFn(pageNum.current, pageSize.current, setLoading, () => pageNum.current++), [])

  useListenContentScroll({ loadMoreFn: () => fetchFn(pageNum.current, pageSize.current, setLoading, () => pageNum.current++) })

  const renderActions = (item: any, index: number) => {
    const actions: React.ReactNode[] = []
    onDetail &&
      actions.push(
        <Button
          type='link'
          style={{ padding: '0' }}
          onClick={() => onDetail(item, index)}
        >
          详情
        </Button>
      )
    onUpdate &&
      actions.push(
        <Button
          style={{ padding: '0' }}
          type='link'
          onClick={() => onUpdate(item, index)}
        >
          更新
        </Button>
      )
    onDelete &&
      actions.push(
        <Popconfirm
          title='确定删除该文章？'
          okText='确认'
          cancelText='取消'
          onConfirm={() => onDelete(item, index)}
        >
          <Button
            style={{ padding: '0' }}
            type='link'
            danger
          >
            删除
          </Button>
        </Popconfirm>
      )
    return actions
  }

  return (
    <>
      {!dataSource && (
        <Skeleton
          style={{
            width: '100%'
          }}
          active
        />
      )}
      {dataSource && (
        <List
          bordered={bordered}
          dataSource={dataSource}
          pagination={false}
          split={split}
          renderItem={(item, index) => (
            <List.Item
              key={JSON.stringify(item)}
              actions={renderActions(item, index)}
              style={{
                padding: 0
              }}
            >
              <div className='w-full'>{itemRender(item)}</div>
            </List.Item>
          )}
        ></List>
      )}
      {loading && dataSource && <Loading></Loading>}
    </>
  )
}

export default LoadMoreList
