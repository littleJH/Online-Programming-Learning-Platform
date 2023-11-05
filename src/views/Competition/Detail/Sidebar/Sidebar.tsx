import React, { useEffect, useState } from 'react'
import { ICompetition, CompetitionType } from '@/type'
import style from './sidebar.module.scss'
import { getCurrentUserinfo, getUserInfoApi } from '@/api/user'
import dayjs from 'dayjs'
import { Button, Modal, Space } from 'antd'
import { getEnterConditionApi } from '@/api/competitionStandardMixture'
import { getStandardUserListApi } from '@/api/competitionStandardMixture'
import CompetitionTypeLabel from '../Label.tsx/CompetitionTypeLabel'

interface Iprops {
  type: CompetitionType
  competition: ICompetition | undefined
  setopenUpdateModal: Function
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

const Sidebar: React.FC<Iprops> = (props) => {
  const { type, competition, setopenUpdateModal } = props
  const [openUserListModal, setopenUserListModal] = useState(false)
  const [duration, setduration] = useState('')
  const [founder, setfounder] = useState()
  const [isfounder, setisfounder] = useState<boolean>()
  const [standardCondition, setstandardCondition] = useState<boolean>(false)

  useEffect(() => {
    if (competition && type) {
      // getEnterConditionApi(type, competition?.id as string).then(res => {
      //   console.log('EnterCondition', res)
      //   setstandardCondition(res.data.data.enter)
      // })
      getUserInfoApi(competition?.user_id as string)
        .then((res) => {
          setfounder(res.data.data.user.name)
        })
        .catch((err) => {})
      getCurrentUserinfo().then((res) => {
        if (res.data.data.user.id === competition?.user_id) {
          setisfounder(true)
        }
      })
      setduration(getDuration(competition?.start_time as string, competition?.end_time as string))
    }
  }, [competition, type])

  const handleClick = () => {
    setopenUserListModal(true)
    if (standardCondition) {
      getStandardUserListApi(type, competition?.id as string).then((res) => {
        console.log(res)
      })
    } else {
    }
  }

  return (
    <div className='p-4'>
      <div className={`${style.item}`}>
        <div className={`${style.itemLabel}`}>标题</div>
        <div className={`${style.itemValue}`}>{competition?.title}</div>
      </div>
      <div className={`${style.item}`}>
        <div className={`${style.itemLabel}`}>开始时间</div>
        <div className={`${style.itemValue}`}>{competition?.start_time}</div>
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
            type={competition?.type as CompetitionType}
          ></CompetitionTypeLabel>
        </div>
      </div>
      <div className={`${style.item}`}>
        <div className={`${style.itemLabel}`}>举办者</div>
        <div
          className={`${style.itemValue} hover:cursor-pointer hover:text-blue-500 hover:underline`}
          onClick={() => {}}
        >
          {founder}
        </div>
      </div>
      {isfounder && (
        <div className='flex justify-center'>
          <Space>
            {/* <Button type="dashed" danger onClick={() => handleClick()}>
              {standardCondition ? '标准比赛报名列表' : '报名标准比赛'}
            </Button> */}
            <Button
              type='dashed'
              danger
              onClick={() => setopenUpdateModal(true)}
            >
              修改比赛
            </Button>
          </Space>
        </div>
      )}
      <Modal
        open={openUserListModal}
        title={''}
        onCancel={() => setopenUserListModal(false)}
        footer={[]}
      ></Modal>
    </div>
  )
}

export default Sidebar
