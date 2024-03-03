import { IPrblemTableDataType, IProblem } from '@/type'
import { Button, Popover, Skeleton, Space, Table, Tag, Tooltip, Divider } from 'antd'
import Column from 'antd/es/table/Column'
import copy from 'copy-to-clipboard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReadOnly from '../../editor/Readonly'
import { getRecordListApi } from '@/api/record'
import { getProblemLabelsApi } from '@/api/problem'
import AcPercentLabel from '../../Label/ProblemLabel/AcPercentLabel'
import { useRecoilValue } from 'recoil'
import { notificationApi, themeState } from '@/store/appStore'
import MyTag from '../../Label/MyTag'
import { getPagination } from '@/config/config'
import GeneralTable from '../../table/GeneralTable'

interface IProps {
  mode: 'select' | 'default' | 'action'
  problemList: IProblem[]
  pageNum: number
  pageSize: number
  setPageNum: Function
  setPageSize: Function
  total: number
  fetchDone: boolean
  setFetchDone: Function
  setFirst: Function
  onPageChange: Function
  onLineClick: Function
  onDelete?: Function
  onUpdate?: Function
  tableScrollHeight?: number
  setSelectedProblems?: Function
  selectedRowKeys?: React.Key[]
}

let flag = false

const ProblemTable: React.FC<IProps> = (props) => {
  const {
    mode,
    pageNum,
    pageSize,
    total,
    tableScrollHeight,
    setSelectedProblems,
    selectedRowKeys,
    problemList,
    onPageChange,
    onLineClick,
    onDelete,
    onUpdate,
    fetchDone,
    setFetchDone,
    setPageNum,
    setPageSize,
    setFirst,
  } = props
  const [dataSource, setDataSource] = useState<IPrblemTableDataType[]>([])
  const theme = useRecoilValue(themeState)
  const notification = useRecoilValue(notificationApi)

  useEffect(() => console.log('dataSource ==> ', dataSource), [dataSource])
  useEffect(() => {
    flag && fetchProblems(problemList)
    flag = true
  }, [problemList])

  const handleKyeClick = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const flag = copy(value)
    if (flag) {
      notification &&
        notification.success({
          message: '已复制到剪切板',
          duration: 1,
        })
    }
  }

  const fetchProblems = async (problems: IProblem[]) => {
    console.log('fetchProblems')
    let index = 0
    const list: IPrblemTableDataType[] = []
    for (let problem of problems) {
      const res = await Promise.all([
        getRecordListApi({
          problem_id: problem.id,
        }),
        getRecordListApi({
          problem_id: problem.id,
          condition: 'Accepted',
        }),
        getProblemLabelsApi(problem.id),
      ])
      list.push({
        key: problem.id as string,
        index: (pageNum - 1) * pageSize + index + 1,
        title: problem.title,
        description: problem.description,
        totaRecords: res[0].data.data.total,
        accpet: res[1].data.data.total,
        acPerc: <AcPercentLabel total={res[0].data.data.total} accept={res[1].data.data.total}></AcPercentLabel>,
        labels: res[2].data.data.problemLabels,
      })
      index++
    }
    setFetchDone(true)
    setFirst(false)
    flag = true
    setDataSource(list)
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleShowSizeChange = (current: number, size: number) => {
    setPageNum(current)
    setPageSize(size)
  }

  const columns = [
    {
      title: 'KEY',
      dataIndex: 'key',
      render: (value: string) => (
        <Tooltip mouseEnterDelay={0.3} title={`点击复制 ${value}`}>
          <div className="select-none hover:cursor-pointer" onClick={(e) => handleKyeClick(value, e)}>
            <div className="w-16">{value.slice(value.length - 5)}</div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (value: string, _: any, index: number) => (
        <Popover
          mouseEnterDelay={0.3}
          title={value}
          content={<ReadOnly html={dataSource[index].description}></ReadOnly>}
          overlayStyle={{
            maxWidth: '512px',
          }}
          overlayInnerStyle={{
            maxHeight: '256px',
            overflow: 'scroll',
          }}
        >
          <div
            color={theme.colorPrimary}
            style={{
              width: '196px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <span className="cursor-pointer" onClick={handleTitleClick}>
              {value}
            </span>
          </div>
        </Popover>
      ),
    },
    {
      title: '标签',
      dataIndex: 'labels',
      render: (value: string[]) => (
        <div
          style={{
            width: '10rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {value.map((item: any, index: number) => {
            return index <= 1 ? <MyTag key={index}>{item.label}</MyTag> : null
          })}
        </div>
      ),
    },
    {
      title: 'AC率',
      dataIndex: 'acPerc',
      render: (value: any) => <div className="">{value}</div>,
    },
  ]

  const actions = [
    {
      title: '操作',
      render: (_: any, __: any, index: number) => (
        <div style={{ width: '6rem' }}>
          {onUpdate && (
            <Button type="link" size="small" style={{ padding: '0' }} onClick={() => onUpdate(index)}>
              更新
            </Button>
          )}

          {onDelete && (
            <>
              <Divider type="vertical"></Divider>
              <Button type="link" style={{ padding: '0' }} size="small" danger onClick={() => onDelete(index)}>
                删除
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const tableProps = {
    dataSource,
    columns,
    actions,
    pageProps: {
      pageNum,
      pageSize,
      total,
      onPageChange,
    },
    scroll:
      mode === 'select'
        ? {
            y: tableScrollHeight,
          }
        : undefined,
    rowSelection:
      mode === 'select' && setSelectedProblems
        ? {
            columnWidth: 64,
            selectedRowKeys: selectedRowKeys,
            onChange: (value: any, selectedRows: any, info: any) => {
              if (info.type === 'all') {
                value.length
                  ? setSelectedProblems((prev: any) => [...prev, ...selectedRows])
                  : setSelectedProblems((prev: IPrblemTableDataType[]) => [
                      ...prev.filter((value) => dataSource.findIndex((val) => val.key === value.key) === -1),
                    ])
              }
            },
            onSelect: (record: any, selected: any) => {
              selected
                ? setSelectedProblems((prev: IPrblemTableDataType[]) => [...prev, record])
                : setSelectedProblems((prev: IPrblemTableDataType[]) => [
                    ...prev.filter((value) => value.key !== record.key),
                  ])
            },
          }
        : undefined,
    onRow: (record: any) => {
      return {
        onClick: () => onLineClick(record),
      }
    },
  }

  return (
    <div>
      {!fetchDone && (
        <Skeleton
          style={{
            width: '100%',
          }}
          active
          paragraph={{
            rows: pageSize,
          }}
        />
      )}
      {fetchDone && <GeneralTable {...tableProps}></GeneralTable>}
    </div>
  )
}

export default ProblemTable
