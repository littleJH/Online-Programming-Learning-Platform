import { IPrblemTableDataType, IProblem } from '@/type'
import { Button, Popover, Skeleton, Space, Table, Tag, Tooltip, Divider, Popconfirm } from 'antd'
import Column from 'antd/es/table/Column'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReadOnly from '../../editor/Readonly'
import { getRecordListApi } from '@/api/record'
import { getProblemLabelsApi } from '@/api/problem'
import AcPercentLabel from '../../Label/ProblemLabel/AcPercentLabel'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, notificationApi, themeState } from '@/store/appStore'
import MyTag from '../../Label/MyTag'
import { getPagination } from '@/config/config'
import GeneralTable from '../../table/GeneralTable'
import utils from '@/tool/myUtils/utils'
import style from '../style.module.scss'
import LoadMoreList from '@/components/List/LoadMoreList'
import ProblemCard from '@/components/Card/ProblemCard'

interface IProps {
  mode: 'checkbox' | 'default' | 'action' | 'radio'
  problemList: IProblem[]
  pageNum: number
  pageSize: number
  // setPageNum: Function
  // setPageSize: Function
  total: number
  fetchDone: boolean
  setFetchDone: Function
  onPageChange: (pageNum: number, pageSize: number) => void
  onLineClick: Function
  setFirst?: Function
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
    // setPageNum,
    // setPageSize,
    setFirst,
  } = props
  const [dataSource, setDataSource] = useState<IPrblemTableDataType[]>([])
  const notification = useRecoilValue(notificationApi)
  const isMobile = useRecoilValue(isMobileAtom)

  useEffect(() => {
    flag && problemList.length > 0 && fetchProblems(problemList)
    flag = true
  }, [problemList])

  useEffect(() => console.log('fetch done ==> ', fetchDone), [fetchDone])

  const handleKyeClick = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const flag = utils.copyToClipboard(value)
    if (flag) {
      notification &&
        notification.success({
          message: '已复制到剪切板',
          duration: 1,
        })
    }
  }

  const fetchProblems = async (problems: IProblem[]) => {
    // if (problems.length === 0) return
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
        key: problem?.key || problem.id,
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
    setFirst && setFirst(false)
    setDataSource(list)
    console.log('before fetch done ...', list)
    setFetchDone(true)
    flag = true
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    // e.stopPropagation()
  }

  // const handleShowSizeChange = (current: number, size: number) => {
  //   setPageNum(current)
  //   setPageSize(size)
  // }

  const getColumns = () => {
    const keyColumn = {
      title: 'KEY',
      dataIndex: 'key',
      render: (value: string) => (
        <Tooltip mouseEnterDelay={0.3} title={`点击复制 ${value}`}>
          <div className="select-none hover:cursor-pointer" onClick={(e) => handleKyeClick(value, e)}>
            <div className="w-16">{value.slice(value.length - 5)}</div>
          </div>
        </Tooltip>
      ),
    }
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        render: (value: string, record: any) => (
          // <div onClick={() => onLineClick()}>
          //   <Popover
          //     mouseEnterDelay={0.3}
          //     title={value}
          //     content={<ReadOnly html={dataSource[index].description}></ReadOnly>}
          //     overlayStyle={{
          //       maxWidth: '512px',
          //     }}
          //     overlayInnerStyle={{
          //       maxHeight: '256px',
          //       overflow: 'scroll',
          //     }}
          //   >
          //   <div
          //     color={theme.colorPrimary}
          //     style={{
          //       maxWidth: isMobile ? '10rem' : '14rem',
          //       overflow: 'hidden',
          //       whiteSpace: 'nowrap',
          //       textOverflow: 'ellipsis',
          //     }}
          //   >
          //     <span className="cursor-pointer" onClick={handleTitleClick}>
          //       {value}
          //     </span>
          //   </div>
          //   </Popover>
          // </div>
          <div className={style.title} onClick={() => onLineClick(record)}>
            <span onClick={handleTitleClick}>{value}</span>
          </div>
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

    return isMobile ? columns : [keyColumn, ...columns]
  }

  const actions = [
    {
      title: '操作',
      render: (_: any, __: any, index: number) => (
        <div style={{ minWidth: '8rem' }}>
          {onUpdate && (
            <Button
              type="link"
              size="small"
              style={{ padding: '0' }}
              onClick={(e) => {
                e.stopPropagation()
                onUpdate(index)
              }}
            >
              更新
            </Button>
          )}

          {onDelete && (
            <>
              <Divider type="vertical"></Divider>
              <Popconfirm
                title="确认删除？"
                okText="确认"
                cancelText="取消"
                onConfirm={(e) => {
                  onDelete(index)
                }}
              >
                <Button type="link" style={{ padding: '0' }} size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ]

  const tableProps = {
    dataSource,
    columns: getColumns(),
    pageProps: {
      pageNum,
      pageSize,
      total,
      onPageChange,
    },
    // scroll:
    //   mode === 'checkbox' || mode === 'radio'
    //     ? {
    //         y: tableScrollHeight,
    //       }
    //     : undefined,
    rowSelection:
      (mode === 'checkbox' || mode === 'radio') && setSelectedProblems
        ? {
            type: mode,
            columnWidth: 64,
            selectedRowKeys: selectedRowKeys,
            onChange: (value: any, selectedRows: any, info: any) => {
              if (mode === 'radio') {
                setSelectedProblems(selectedRows)
              } else {
                if (info.type === 'all') {
                  value.length
                    ? setSelectedProblems((prev: any) => [...prev, ...selectedRows])
                    : setSelectedProblems((prev: IPrblemTableDataType[]) => [
                        ...prev.filter((value) => dataSource.findIndex((val) => val.key === value.key) === -1),
                      ])
                }
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
        // onClick: () => onLineClick(record),
      }
    },
  }

  const getTableProps = () => {
    return mode === 'action' ? { ...tableProps, actions } : tableProps
  }

  return (
    <div className={style.problemTable}>
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
      {fetchDone && <GeneralTable {...getTableProps()}></GeneralTable>}
      {/* {fetchDone && (
        <LoadMoreList
          dataSource={dataSource}
          total={total}
          itemRender={(item: any) => <ProblemCard problemProps={item}></ProblemCard>}
          fetchFn={() => {}}
        ></LoadMoreList>
      )} */}
    </div>
  )
}

export default ProblemTable
