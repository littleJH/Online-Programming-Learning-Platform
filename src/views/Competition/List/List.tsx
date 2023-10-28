import React, { useEffect, useState } from 'react'
import { getCompetitionListApi } from '@/api/competition'
import { Skeleton, Table } from 'antd'
import { ICompetition } from '@/type'
import dayjs from 'dayjs'
import Column from 'antd/es/table/Column'
import { useNavigate } from 'react-router-dom'
import CompetitionTypeLabel from '../Detail/Label.tsx/CompetitionTypeLabel'

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

const getState = (start: string, end: string): State => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return 'notStart'
  } else if (
    dayjs(start).valueOf() < dayjs().valueOf() &&
    dayjs(end).valueOf() > dayjs().valueOf()
  ) {
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
  const nav = useNavigate()
  const [competitionList, setcompetitionList] = useState()
  const [dataSource, setdataSource] = useState<IDataSource[]>([])
  useEffect(() => {
    getCompetitionListApi()
      .then(res => res.data.data.competitions)
      .then(async (data: ICompetition[]) => {
        data.forEach((competition, index) => {
          setdataSource(value => [
            ...value,
            {
              id: competition.id,
              title: {
                value: competition.title,
                label: (
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => handleClick(competition.id)}
                  >
                    {competition.title}
                  </div>
                )
              },
              type: competition.type,
              start_time: competition.start_time,
              duration: getDuration(
                competition.start_time,
                competition.end_time
              ),
              state: getState(competition.start_time, competition.end_time),
              key: competition.id
            }
          ])
        })
      })
  }, [])

  const handleClick = (id: string) => {
    console.log(id)
    nav(`/competition/${id}`)
  }
  return (
    <div>
      {dataSource.length === 0 ? (
        <Skeleton
          active
          paragraph={{
            rows: 10
          }}
        />
      ) : (
        <Table style={{ width: '800px' }} dataSource={dataSource} size="large">
          <Column
            align="center"
            key={'state'}
            title="状态"
            dataIndex={'state'}
            render={(value: State) => {
              switch (value) {
                case 'notStart':
                  return (
                    <svg className="icon" aria-hidden={true}>
                      <use href="#icon-weikaishi"></use>
                    </svg>
                  )
                case 'underway':
                  return (
                    <svg className="icon" aria-hidden={true}>
                      <use href="#icon-jinhangzhong"></use>
                    </svg>
                  )
                case 'finished':
                  return (
                    <svg className="icon" aria-hidden={true}>
                      <use href="#icon-yijieshu"></use>
                    </svg>
                  )
                default:
                  return
              }
            }}
          ></Column>
          <Column
            align="center"
            key={'title'}
            title="比赛名称"
            dataIndex={['title', 'label']}
          ></Column>
          <Column
            align="center"
            key={'type'}
            title="比赛类型"
            dataIndex={'type'}
            render={value => {
              return (
                <CompetitionTypeLabel
                  className="icon-small"
                  type={value}
                ></CompetitionTypeLabel>
              )
            }}
          ></Column>
          <Column
            align="center"
            key={'start_time'}
            title="开始时间"
            dataIndex={'start_time'}
          ></Column>
          <Column
            align="center"
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
