import { IPrblemTableDataType, IProblem } from '@/type'
import {
  Button,
  Popover,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  notification
} from 'antd'
import Column from 'antd/es/table/Column'
import copy from 'copy-to-clipboard'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReadOnly from '../Editor/ReadOnly'
import { getRecordListApi } from '@/api/record'
import { getProblemLabelsApi } from '@/api/problem'
import AcPercentLabel from '../Label/ProblemLabel/AcPercentLabel'

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
  onTitleClick: Function
  onDelete?: Function
  onUpdate?: Function
  tableScrollHeight?: number
  setSelectedProblems?: Function
  selectedRowKeys?: React.Key[]
}

let flag = false

const ProblemTable: React.FC<IProps> = props => {
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
    onTitleClick,
    onDelete,
    onUpdate,
    fetchDone,
    setFetchDone,
    setPageNum,
    setPageSize,
    setFirst
  } = props
  const [dataSource, setDataSource] = useState<IPrblemTableDataType[]>([])

  useEffect(() => {
    flag && fetchProblems(problemList)
    flag = true
  }, [problemList])

  const handleKyeClick = useCallback((value: string) => {
    const flag = copy(value)
    if (flag) {
      notification.success({
        message: '已复制到剪切板',
        placement: 'topRight',
        duration: 1
      })
    }
  }, [])

  const fetchProblems = useCallback(async (problems: IProblem[]) => {
    console.log('fetchProblems')
    let index = 0
    const list: IPrblemTableDataType[] = []
    for (let problem of problems) {
      const res = await Promise.all([
        getRecordListApi({
          problem_id: problem.id
        }),
        getRecordListApi({
          problem_id: problem.id,
          condition: 'Accepted'
        }),
        getProblemLabelsApi(problem.id)
      ])
      list.push({
        key: problem.id as string,
        index: (pageNum - 1) * pageSize + index + 1,
        title: problem.title,
        description: problem.description,
        totaRecords: res[0].data.data.total,
        accpet: res[1].data.data.total,
        acPerc: (
          <AcPercentLabel
            total={res[0].data.data.total}
            accept={res[1].data.data.total}
          ></AcPercentLabel>
        ),
        labels: res[2].data.data.problemLabels
      })
      index++
    }
    setFetchDone(true)
    setFirst(false)
    flag = true
    setDataSource(list)
  }, [])

  return (
    <div>
      {!fetchDone ? (
        <Skeleton
          style={{
            width: '100%'
          }}
          active
          paragraph={{
            rows: pageSize
          }}
        />
      ) : (
        <Table
          scroll={
            mode === 'select'
              ? {
                  y: tableScrollHeight
                }
              : undefined
          }
          rowSelection={
            mode === 'select' && setSelectedProblems
              ? {
                  columnWidth: 64,
                  selectedRowKeys: selectedRowKeys,
                  onChange: (value, selectedRows, info) => {
                    if (info.type === 'all') {
                      value.length
                        ? setSelectedProblems((prev: any) => [
                            ...prev,
                            ...selectedRows
                          ])
                        : setSelectedProblems(
                            (prev: IPrblemTableDataType[]) => [
                              ...prev.filter(
                                value =>
                                  dataSource.findIndex(
                                    val => val.key === value.key
                                  ) === -1
                              )
                            ]
                          )
                    }
                  },
                  onSelect: (record, selected) => {
                    selected
                      ? setSelectedProblems((prev: IPrblemTableDataType[]) => [
                          ...prev,
                          record
                        ])
                      : setSelectedProblems((prev: IPrblemTableDataType[]) => [
                          ...prev.filter(value => value.key !== record.key)
                        ])
                  }
                }
              : undefined
          }
          size="small"
          pagination={{
            position: ['bottomCenter'],
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showQuickJumper: true,
            hideOnSinglePage: true,
            onShowSizeChange: (current, size) => {
              setPageNum(current)
              setPageSize(size)
            },
            onChange: (page, pageSize) => onPageChange(page, pageSize)
          }}
          dataSource={dataSource}
        >
          {/* <Column  title="序号" dataIndex={'index'}></Column> */}
          <Column
            title="KEY"
            dataIndex={'key'}
            width={128}
            render={(value: string) => (
              <Tooltip
                mouseEnterDelay={0.3}
                title={`点击复制 ${value}`}
                color="white"
                overlayInnerStyle={{
                  color: 'black'
                }}
              >
                <div
                  className="select-none hover:cursor-pointer"
                  onClick={() => handleKyeClick(value)}
                >
                  <div
                    className="w-16"
                    // style={{
                    //   overflow: 'hidden',
                    //   textOverflow: 'ellipsis',
                    //   whiteSpace: 'nowrap'
                    // }}
                  >
                    {value.slice(value.length - 5)}
                  </div>
                </div>
              </Tooltip>
            )}
          ></Column>
          <Column
            title="标题"
            dataIndex={'title'}
            render={(value, _, index) => (
              <Popover
                mouseEnterDelay={0.3}
                title={value}
                content={
                  <ReadOnly html={dataSource[index].description}></ReadOnly>
                }
                overlayStyle={{
                  maxWidth: '512px'
                }}
                overlayInnerStyle={{
                  maxHeight: '256px',
                  overflow: 'scroll'
                }}
              >
                <div
                  className="hover:cursor-pointer text-indigo-500 min-w-max"
                  onClick={() => onTitleClick(index)}
                >
                  {value}
                </div>
              </Popover>
            )}
          ></Column>

          <Column
            title="标签"
            dataIndex={'labels'}
            render={value => (
              <>
                {value.map((item: any, index: number) => {
                  return (
                    <Tag key={index} bordered={false} color="#f1f5f9">
                      <div className="text-slate-700">{item.label}</div>
                    </Tag>
                  )
                })}
              </>
            )}
          ></Column>
          <Column
            title="AC率"
            dataIndex={'acPerc'}
            width={128}
            render={value => <div className="">{value}</div>}
          ></Column>
          {mode === 'action' && (
            <Column
              title="操作"
              render={(_, __, index) => (
                <>
                  {onUpdate && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onUpdate(index)}
                    >
                      更新
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => onDelete(index)}
                    >
                      删除
                    </Button>
                  )}
                </>
              )}
            ></Column>
          )}
        </Table>
      )}
    </div>
  )
}

export default ProblemTable
