import React, { useEffect, useState } from 'react'
import { getCompetitionListApi } from '@/api/competition'
import { Skeleton, Table, theme } from 'antd'
import { ICompetition } from '@/type'
import dayjs from 'dayjs'
import Column from 'antd/es/table/Column'
import CompetitionTypeLabel from '@/views/Competition/CompetitionCommon/component/Label/CompetitionTypeLabel'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import useNavTo from '@/tool/myHooks/useNavTo'

type State = 'notStart' | 'underway' | 'finished'

interface IDataSource {
  state: State
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

const getState = (start: string, end: string): State => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return 'notStart'
  } else if (dayjs(start).valueOf() < dayjs().valueOf() && dayjs(end).valueOf() > dayjs().valueOf()) {
    return 'underway'
  } else return 'finished'
}

const getDuration = (start: string, end: string): string => {
  const mill = dayjs(end).unix() - dayjs(start).unix()
  const duration = {
    hour: 0,
    min: 0
  }
  duration.hour = Math.floor(mill / 3600)
  duration.min = (mill - duration.hour * 3600) / 60

  return `${duration.hour} 小时 ${duration.min} 分钟`
}

const View: React.FC = () => {
  const nav = useNavTo()
  const [competitionList, setcompetitionList] = useState()
  const [dataSource, setdataSource] = useState<IDataSource[]>([])
  const { token } = theme.useToken()

  useEffect(() => {
    getCompetitionListApi().then((res) => {
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
                  <div
                    className='hover:cursor-pointer'
                    onClick={() => handleClick(competition)}
                  >
                    {competition.title}
                  </div>
                )
              },
              type: competition.type,
              start_time: competition.start_time,
              duration: getDuration(competition.start_time, competition.end_time),
              state: getState(competition.start_time, competition.end_time),
              key: competition.id
            }
          ])
        })
    })
  }, [])

  const handleClick = (competition: ICompetition) => {
    nav(`/competition/${competition.id}`)
  }
  return (
    <div style={{ minWidth: '800px' }}>
      {dataSource.length === 0 ? (
        <Skeleton
          active
          paragraph={{
            rows: 10
          }}
        />
      ) : (
        <Table
          dataSource={dataSource}
          size='small'
        >
          <Column
            key={'state'}
            title='状态'
            dataIndex={'state'}
            render={(value: State) => {
              switch (value) {
                case 'notStart':
                  return (
                    <MySvgIcon
                      href='#icon-weikaishi'
                      size={stateIconSize}
                      color={token.colorInfoTextHover}
                    ></MySvgIcon>
                  )
                case 'underway':
                  return (
                    <MySvgIcon
                      href='#icon-jinhangzhong'
                      size={stateIconSize}
                      color={token.colorSuccessTextHover}
                    ></MySvgIcon>
                  )
                case 'finished':
                  return (
                    <MySvgIcon
                      href='#icon-yijieshu'
                      size={stateIconSize}
                      color={token.colorErrorTextHover}
                    ></MySvgIcon>
                  )
                default:
                  return
              }
            }}
          ></Column>
          <Column
            key={'title'}
            title='比赛名称'
            dataIndex={['title', 'label']}
          ></Column>
          <Column
            key={'type'}
            title='比赛类型'
            dataIndex={'type'}
            render={(value) => {
              return (
                <CompetitionTypeLabel
                  type={value}
                  size={1}
                ></CompetitionTypeLabel>
              )
            }}
          ></Column>
          <Column
            key={'start_time'}
            title='开始时间'
            dataIndex={'start_time'}
          ></Column>
          <Column
            key={'duration'}
            title={'时长'}
            dataIndex={'duration'}
          ></Column>
        </Table>
      )}
    </div>
  )
}

export default View
