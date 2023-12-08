import React, { useState } from 'react'
import { Button, Space, Card, Tooltip } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  CompetitionState,
  CompetitionType,
  ICompetition,
  ICountDown,
} from '@/type'
import CompetitionTypeLabel from './CompetitionCommon/component/Label/CompetitionTypeLabel'
import CountDown from '@/components/countDown/CountDown'
import { useRecoilState } from 'recoil'
import { competitionStateAtom } from './store'
import useNavTo from '@/tool/myHooks/useNavTo'

const Competition: React.FC = () => {
  // const nav = useNavTo()
  // const [competitionState, setcompetitionState] = useRecoilState(competitionStateAtom)
  // const [competition, setcompetition] = useState<ICompetition>()
  // const [endTime, setEndTime] = useState<string>()
  // const [enterNum, setenterNum] = useState()
  // const [countDown, setcountDown] = useState<ICountDown>()

  return (
    <div className="flex-grow h-full w-full flex justify-center">
      {/* header */}
      {/* <Card>
        <div className='flex'>
          <div className='flex flex-col items-center justify-center'>
            <svg
              onClick={() => {
                ;['notEnter', 'enter'].includes(competitionState as string) ? setopenEnterModal(true) : null
              }}
              className='icon-large hover:cursor-pointer'
              aria-hidden={true}
            >
              {competitionState === 'notEnter' && <use href='#icon-weibaoming'></use>}
              {competitionState === 'enter' && <use href='#icon-yibaoming'></use>}
              {competitionState === 'underway' && <use href='#icon-jinhangzhong'></use>}
              {competitionState === 'finished' && <use href='#icon-yijieshu'></use>}
            </svg>
          </div>
          <div className='flex-grow'>
            <div className=' flex justify-center items-center text-3xl font-bold '>
              <CompetitionTypeLabel
                size={3}
                showLabel={false}
                type={competition?.type as CompetitionType}
              ></CompetitionTypeLabel>
              <div className='ml-4'>{competition?.title}</div>
            </div>
            {competitionState !== 'finished' && (
              <CountDown ></CountDown>
            )}
          </div>
          <div className='flex flex-col items-center justify-center'>
            <Tooltip title='查看报名列表'>
              <div
                className=' font-bold hover:cursor-pointer'
                onClick={() => getEnterList()}
              >
                {typeof enterNum === 'number' && (
                  <>
                    <div className='flex justify-center '>{enterNum}名</div>
                    <div>参赛者</div>
                  </>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </Card> */}
      <Outlet></Outlet>
    </div>
  )
}

export default Competition
{
  /* <div className="w-full flex justify-center items-center shadow mb-4 ">
        <div></div>
        <div className="">
          <Space>
            <Button onClick={() => nav('create')}>创建比赛</Button>
            <Button onClick={() => nav('list')}>查看比赛</Button>
            <Button onClick={() => nav('random/single')}>及时个人比赛</Button>
          </Space>
        </div>
      </div> */
}
