import React, { useEffect, useMemo, useState } from 'react'
import {
  getComLabels,
  getCompetitionListApi,
  searchComByLabelApi,
  searchComByTextAndLabelApi,
  searchComByTextApi,
} from '@/api/competition'
import { Skeleton, Table, theme } from 'antd'
import { CompetitionState, CompetitionType, ICompetition } from '@/type'
import dayjs from 'dayjs'
import Column from 'antd/es/table/Column'
import CompetitionTypeLabel from '@/views/Competition/CompetitionCommon/component/Label/CompetitionTypeLabel'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import utils from '@/tool/myUtils/utils'
import GeneralTable, { GeneralTableProps } from '@/components/table/GeneralTable'
import { useSearchParams } from 'react-router-dom'
import { totalmem } from 'os'
import { getEnterConditionApi } from '@/api/competitionMixture'
import MyTag from '@/components/Label/MyTag'
import Search from 'antd/es/input/Search'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../../../style.module.scss'
import { useRecoilValue } from 'recoil'
import { isMobileAtom } from '@/store/appStore'

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
  enter: boolean
  labels: string[]
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
  const isMobile = useRecoilValue(isMobileAtom)
  const nav = myHooks.useNavTo()
  const [loading, setLoading] = useState(false)
  const [querys, setQuerys] = useSearchParams()
  const [dataSource, setdataSource] = useState<IDataSource[]>([])
  const [total, setTotal] = useState(0)
  const { token } = theme.useToken()
  const [filter, setFilter] = useState({
    pageNum: Number(querys.get('pageNum')) || 1,
    pageSize: Number(querys.get('pageSize')) || 20,
    text: querys.get('text') || '',
    label: querys.get('label') || '',
  })

  const size = useMemo(() => (isMobile ? 'middle' : 'large'), [isMobile])

  useEffect(() => {
    setdataSource([])
    fetch()
  }, [filter])

  const fetch = async () => {
    setLoading(true)
    const { text, label, pageNum, pageSize } = filter
    let competitions: ICompetition[] = []
    let total = 0
    let result
    const list: IDataSource[] = []
    if (!text && !label) {
      result = await getCompetitionListApi(pageNum, pageSize)
    } else if (text && !label) {
      result = await searchComByTextApi(text, pageNum, pageSize)
    } else if (!text && label) {
      result = await searchComByLabelApi(label, pageNum, pageSize)
    } else if (text && label) {
      result = await searchComByTextAndLabelApi(text, label, pageNum, pageSize)
    }
    competitions = result ? result.data.data?.competitions || [] : []
    total = result ? result.data.data?.total || 0 : 0

    for (let competition of competitions) {
      const res = await getEnterConditionApi(competition.type, competition.id)
      const res1 = await getComLabels(competition.id)
      list.push({
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
        duration: utils.getDuration(competition.start_time, competition.end_time),
        state: getState(competition.start_time, competition.end_time),
        key: competition.id,
        enter: res.data.data?.enter || false,
        labels: (res1.data.data?.competitionLabels || []).map((item: any) => item.label),
      })
    }
    setTotal(total)
    setdataSource(list)
    setLoading(false)
  }

  const handleClick = (competition: ICompetition) => {
    nav(`/competition/common/${competition.id}/overview`)
  }

  const columns = [
    {
      key: 'state',
      title: '状态',
      align: 'center',
      // width: 100,
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
      render: (value: string, record: IDataSource) => {
        return (
          <div className={style.title}>
            <span>{value}</span>
            <span>
              {record.labels?.map((item, index) => <span key={index}>{index <= 1 && <MyTag>{item}</MyTag>}</span>)}
            </span>
          </div>
        )
      },
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
      onFilter: (value: string, record: IDataSource) => value.toLowerCase() === record.type.toLowerCase(),
      render: (value: CompetitionType) => {
        return (
          <CompetitionTypeLabel type={value === 'OI' ? value : value.toLowerCase()} size={1}></CompetitionTypeLabel>
        )
      },
    },
    {
      key: 'start_time',
      title: '开始时间',
      align: 'center',
      sorter: (a: IDataSource, b: IDataSource) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
      dataIndex: 'start_time',
    },
    {
      key: 'duration',
      title: '时长',
      align: 'center',
      dataIndex: 'duration',
    },
    {
      key: 'enter',
      title: '报名状态',
      dataIndex: 'enter',
      align: 'center',
      render: (value: boolean) => {
        return (
          <>
            {!value && <MySvgIcon href="#icon-weibaoming" color={token.colorWarning} size={stateIconSize}></MySvgIcon>}
            {value && <MySvgIcon href="#icon-yibaoming" color={token.colorInfo} size={stateIconSize}></MySvgIcon>}
          </>
        )
      },
    },
  ]

  const onPageChange = (pageNum: number, pageSize: number) => {
    console.log('onPageChange...', pageNum, pageSize)
    setFilter((value) => {
      return { ...value, pageNum, pageSize }
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

  const handleTextChange = (text: string) => {
    setFilter((value) => {
      return {
        ...value,
        text: text,
      }
    })
    setQuerys((params) => {
      params.set('text', text)
      return params
    })
  }

  const handleLabelChange = (label: string) => {
    setFilter((value) => {
      return {
        ...value,
        label: label,
      }
    })
    setQuerys((params) => {
      params.set('label', label)
      return params
    })
  }

  const handleSearch = () => {}

  return (
    <div className={style.commonset}>
      <div className={style.header}>
        <div className={style.item}>
          <Search
            style={{
              width: '100%',
            }}
            size={size}
            defaultValue={filter.text}
            placeholder="名称搜索"
            enterButton
            onSearch={handleSearch}
            onChange={(e) => handleTextChange(e.target.value)}
          ></Search>
        </div>
        <div className="w-8"></div>
        <div className={style.item}>
          <Search
            style={{
              width: '100%',
            }}
            size={size}
            defaultValue={filter.text}
            placeholder="标签搜索"
            enterButton
            onSearch={fetch}
            onChange={(e) => handleLabelChange(e.target.value)}
          ></Search>
        </div>
      </div>
      <div className={style.content}>
        {loading && (
          <Skeleton
            active
            paragraph={{
              rows: 10,
            }}
          />
        )}
        <div className={style.table}>{!loading && <GeneralTable {...tableProps}></GeneralTable>}</div>
      </div>
    </div>
  )
}

export default View
