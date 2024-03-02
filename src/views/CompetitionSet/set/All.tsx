import React, { useEffect, useState } from 'react'
import { getCompetitionListApi } from '@/api/competition'
import { Skeleton, Table, theme } from 'antd'
import { CompetitionState, CompetitionType, ICompetition } from '@/type'
import dayjs from 'dayjs'
import Column from 'antd/es/table/Column'
import CompetitionTypeLabel from '@/views/Competition/CompetitionCommon/component/Label/CompetitionTypeLabel'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import useNavTo from '@/tool/myHooks/useNavTo'
import { getDuration } from '@/tool/MyUtils/Utils'
import GeneralTable, { GeneralTableProps } from '@/components/table/GeneralTable'
import { useSearchParams } from 'react-router-dom'
import { totalmem } from 'os'

interface IDataSource {
  state: CompetitionState
  title: {
    value: string
    label: JSX.Element
  }
  type: string
  start_time: string
  duration: string
  id: string
  key: string
}

const stateIconSize = 3

const getState = (start: string, end: string): CompetitionState => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return 'notStart'
  } else if (dayjs(start).valueOf() < dayjs().valueOf() && dayjs(end).valueOf() > dayjs().valueOf()) {
    return 'underway'
  } else return 'finished'
}

const View: React.FC = () => {
  const nav = useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const [dataSource, setdataSource] = useState<IDataSource[]>([])
  const [filter, setFilter] = useState({
    pageNum: Number(querys.get('pageNum')) || 1,
    pageSize: Number(querys.get('pageSize')) || 20,
  })
  const [total, setTotal] = useState(0)
  const { token } = theme.useToken()

  useEffect(() => {
    setdataSource([])
    fetch()
  }, [filter])

  const fetch = async () => {
    const res = await getCompetitionListApi(filter.pageNum, filter.pageSize)
    setTotal(res.data?.data?.total || 0)
    const competitions: ICompetition[] = res.data.data?.competitions
    competitions &&
      competitions.forEach((competition, index) => {
        setdataSource((value) => [
          ...value,
          {
            id: competition.id,
            title: {
              value: competition.title,
              label: (
                <div className="hover:cursor-pointer" onClick={() => handleClick(competition)}>
                  {competition.title}
                </div>
              ),
            },
            type: competition.type,
            start_time: competition.start_time,
            duration: getDuration(competition.start_time, competition.end_time),
            state: getState(competition.start_time, competition.end_time),
            key: competition.id,
          },
        ])
      })
  }

  const handleClick = (competition: ICompetition) => {
    nav(`/competition/${competition.id}/overview`)
  }

  const columns = [
    {
      key: 'state',
      title: '状态',
      dataIndex: 'state',
      filters: [
        { text: '未开始', value: 'notStart' },
        { text: '进行中', value: 'underway' },
        { text: '已结束', value: 'finished' },
      ],
      render: (value: CompetitionState) => {
        switch (value) {
          case 'notStart':
            return <MySvgIcon href="#icon-weikaishi" size={stateIconSize} color={token.colorInfoTextHover}></MySvgIcon>
          case 'underway':
            return (
              <MySvgIcon href="#icon-jinhangzhong" size={stateIconSize} color={token.colorSuccessTextHover}></MySvgIcon>
            )
          case 'finished':
            return <MySvgIcon href="#icon-yijieshu" size={stateIconSize} color={token.colorErrorTextHover}></MySvgIcon>
          default:
            return
        }
      },
    },
    {
      key: 'title',
      title: '比赛名称',
      dataIndex: ['title', 'label'],
    },
    {
      key: 'type',
      title: '比赛类型',
      dataIndex: 'type',
      filters: [
        { text: '个人赛', value: 'single' },
        { text: 'OI赛', value: 'OI' },
        { text: '组队赛', value: 'group' },
        { text: '匹配赛', value: 'match' },
      ],
      onFilter: (value: string, record: ICompetition) => value.toLowerCase() === record.type.toLowerCase(),
      render: (value: CompetitionType) => {
        return (
          <CompetitionTypeLabel type={value === 'OI' ? value : value.toLowerCase()} size={1}></CompetitionTypeLabel>
        )
      },
    },
    {
      key: 'start_time',
      title: '开始时间',
      sorter: (a: ICompetition, b: ICompetition) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
      dataIndex: 'start_time',
    },
    {
      key: 'duration',
      title: '时长',
      dataIndex: 'duration',
    },
    {
      key: 'enter',
      title: '报名状态',
      dataIndex: 'enter',
    },
  ]

  const onPageChange = (pageNum: number, pageSize: number) => {
    console.log('onPageChange...', pageNum, pageSize)
    setFilter({
      pageNum,
      pageSize,
    })
    setQuerys((params) => {
      params.set('pageNum', String(pageNum))
      params.set('pageSize', String(pageSize))
      return params
    })
  }

  const tableProps: GeneralTableProps = {
    columns,
    dataSource,
    pageProps: {
      ...filter,
      total,
      onPageChange,
    },
  }

  return (
    <div style={{ minWidth: '800px' }}>
      {dataSource.length === 0 && (
        <Skeleton
          active
          paragraph={{
            rows: 10,
          }}
        />
      )}
      {dataSource.length > 0 && <GeneralTable {...tableProps}></GeneralTable>}
    </div>
  )
}

export default View
