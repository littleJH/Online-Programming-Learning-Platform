import React, { useEffect, useState, useRef } from 'react'
import { List, Button, Popconfirm, Skeleton, theme } from 'antd'
import useListenContentScroll from '@/tool/myHooks/useListenScroll'

interface Iprops {
  dataSource: any
  total: number
  itemRender: Function
  fetchFn: (pageNum: number, pageSize: number, callback: Function) => void
  onDelete?: Function
  onDetail?: Function
  onUpdate?: Function
  bordered?: boolean
  split?: boolean
}

const LoadMoreList: React.FC<Iprops> = (props) => {
  const { dataSource, total, onDelete, onDetail, onUpdate, itemRender, bordered, split = true, fetchFn } = props
  const pageNum = useRef<number>(1)
  const pageSize = useRef<number>(10)
  const { token } = theme.useToken()

  useEffect(() => {
    fetchFn(pageNum.current, pageSize.current, () => pageNum.current++)
  }, [])

  // 监听content滚动触底，因此该LoadMoreList需要在content的底部
  useListenContentScroll({
    loadMoreFn: () => fetchFn(pageNum.current, pageSize.current, () => pageNum.current++)
  })

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
        <div>
          <Skeleton
            avatar
            active
          />
          <Skeleton
            avatar
            active
          />
          <Skeleton
            avatar
            active
          />
        </div>
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
      {dataSource?.length !== total && total !== 0 && (
        <div className='w-full my-8'>
          <Skeleton
            avatar
            active
          />
        </div>
      )}
      {dataSource?.length === total && (
        <div
          className='w-full text-center p-8'
          style={{
            color: token.colorTextDescription
          }}
        >
          到底啦~
        </div>
      )}
    </>
  )
}

export default LoadMoreList
