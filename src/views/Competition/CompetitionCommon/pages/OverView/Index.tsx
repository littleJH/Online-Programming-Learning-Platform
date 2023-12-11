import React, { useEffect, useMemo, useState } from 'react'
import ReadOnly from '@/components/editor/Readonly'
import { useRecoilValue } from 'recoil'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'
import CompetitionTypeLabel from '../../component/Label/CompetitionTypeLabel'
import { getUserInfoApi } from '@/api/user'
import { getDuration } from '@/tool/MyUtils/Utils'
import { Button, Descriptions, Modal, Space } from 'antd'
import { userInfoState } from '@/store/appStore'
import { User } from '@/type'
import useNavTo from '@/tool/myHooks/useNavTo'

const Overview: React.FC = () => {
  const navTo = useNavTo()
  const competition = useRecoilValue(currentCompetitionAtom)
  const userInfo = useRecoilValue(userInfoState)
  const [founder, setFounder] = useState<User>()
  const [duration, setDuration] = useState('')

  useEffect(() => {
    if (!competition) return
    fetchFounder()
    setDuration(getDuration(competition.start_time, competition.end_time))
  }, [competition])

  const fetchFounder = async () => {
    if (!competition) return
    const res = await getUserInfoApi(competition.user_id)
    setFounder(res.data.data.user)
  }

  const toEdit = () => {
    navTo(`/creation/competition/declare?competition_id=${competition?.id}`)
  }

  return (
    <div>
      {competition && (
        <div className="">
          <Descriptions
            items={[
              { key: '1', label: '标题', children: competition.title },
              { key: '2', label: '开始时间', children: competition.start_time },
              { key: '3', label: '结束时间', children: competition.end_time },
              { key: '4', label: '比赛时长', children: duration },
              {
                key: '5',
                label: '类型',
                children: (
                  <CompetitionTypeLabel
                    size={1}
                    type={competition.type}></CompetitionTypeLabel>
                ),
              },
              {
                key: '6',
                label: '发起人',
                children: (
                  <Space>
                    {founder?.name || ''}
                    {founder?.name === userInfo?.name && (
                      <Button
                        size="small"
                        type="dashed"
                        danger
                        onClick={toEdit}>
                        修改比赛
                      </Button>
                    )}
                  </Space>
                ),
              },
              {
                key: '7',
                label: '描述',
                children: <ReadOnly html={competition.content}></ReadOnly>,
              },
            ]}></Descriptions>
          {/* <div className={`${style.item}`}>
            <div className={`${style.itemLabel}`}>标题</div>
            <div className={`${style.itemValue}`}>{competition?.title}</div>
          </div>
          <div className={`${style.item}`}>
            <div className={`${style.itemLabel}`}>开始时间</div>
            <div className={`${style.itemValue}`}>
              {competition?.start_time}
            </div>
          </div>
          <div className={`${style.item}`}>
            <div className={`${style.itemLabel}`}>比赛时长</div>
            <div className={`${style.itemValue}`}>{duration}</div>
          </div>
          <div className={`${style.item}`}>
            <div className={`${style.itemLabel}`}>类型</div>
            <div className={`${style.itemValue}`}>
              <CompetitionTypeLabel
                size={1}
                type={competition?.type}></CompetitionTypeLabel>
            </div>
          </div>
          <div className={`${style.item}`}>
            <div className={`${style.itemLabel}`}>举办者</div>
            <div
              className={`${style.itemValue} hover:cursor-pointer hover:text-blue-500 hover:underline`}
              onClick={() => {}}>
              {founder}
            </div>
          </div> */}
          {/* {founder?.name === userInfo?.name && (
            <div className='flex justify-center'>
              <Space>
                <Button type="dashed" danger onClick={() => handleClick()}>
                {standardCondition ? '标准比赛报名列表' : '报名标准比赛'}
              </Button>
                <Button type='dashed' danger onClick={() => {}}>
                  修改比赛
                </Button>
              </Space>
            </div>
          )} */}
        </div>
      )}
    </div>
  )
}

export default Overview
