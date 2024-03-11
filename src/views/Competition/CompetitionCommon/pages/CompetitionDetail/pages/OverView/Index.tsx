import React, { useEffect, useMemo, useState } from 'react'
import ReadOnly from '@/components/editor/Readonly'
import { useRecoilValue } from 'recoil'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'
import CompetitionTypeLabel from '../../../../component/Label/CompetitionTypeLabel'
import { getUserInfoApi } from '@/api/user'
import utils from '@/tool/myUtils/utils'
import { Button, Descriptions, Modal, Space } from 'antd'
import { notificationApi, userInfoState } from '@/store/appStore'
import { ICompetition, User } from '@/type'
import dayjs from 'dayjs'
import myHooks from '@/tool/myHooks/myHooks'
import MyTag from '@/components/Label/MyTag'

const Overview: React.FC = () => {
  const navTo = myHooks.useNavTo()
  const competition = useRecoilValue(currentCompetitionAtom)
  const userInfo = useRecoilValue(userInfoState)
  const [founder, setFounder] = useState<User>()
  const [duration, setDuration] = useState('')
  const notification = useRecoilValue(notificationApi)

  useEffect(() => {
    if (!competition) return
    fetchFounder()
    setDuration(utils.getDuration(competition.start_time, competition.end_time))
  }, [competition])

  const fetchFounder = async () => {
    if (!competition) return
    const res = await getUserInfoApi(competition.user_id)
    setFounder(res.data.data.user)
  }

  const toEdit = () => {
    const start = competition?.start_time
    if (dayjs(start).valueOf() <= dayjs().valueOf()) {
      notification && notification.error({ message: '比赛进行中或已结束，无法修改' })
      return
    }
    navTo(`/creation/competition/declare?competition_id=${competition?.id}`)
  }

  const getDescItems = (competition: ICompetition) => {
    const items = [
      { key: '1', label: '标题', children: competition.title },
      { key: '2', label: '开始时间', children: competition.start_time },
      { key: '3', label: '结束时间', children: competition.end_time },
      { key: '4', label: '比赛时长', children: duration },
      {
        key: '5',
        label: '类型',
        children: <CompetitionTypeLabel size={1} type={competition.type}></CompetitionTypeLabel>,
      },
      {
        key: '6',
        label: '发起人',
        children: (
          <Space>
            {founder?.name || ''}
            {founder?.name === userInfo?.name && (
              <Button size="small" type="dashed" danger onClick={toEdit}>
                修改比赛
              </Button>
            )}
          </Space>
        ),
      },
    ]

    if (competition.labels && competition.labels?.length > 0) {
      items.push({
        key: '7',
        label: '标签',
        children: (
          <span>
            {competition.labels?.map((item, index) => (
              <span key={index}>{index <= 1 && <MyTag size={1}>{item.label}</MyTag>}</span>
            ))}
          </span>
        ),
      })
    }
    return items
  }

  return (
    <div>
      {competition && (
        <div className="">
          <Descriptions items={getDescItems(competition)}></Descriptions>
          <Descriptions
            items={[
              {
                key: '7',
                label: '描述',
                children: <ReadOnly html={competition.content}></ReadOnly>,
              },
            ]}
          ></Descriptions>
        </div>
      )}
    </div>
  )
}

export default Overview
