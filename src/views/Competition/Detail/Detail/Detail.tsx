import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { showCompetitionApi } from '@/api/competition'
import {
  cancelEnterApi,
  enterCompetitionApi,
  getEnterListApi
} from '@/api/competitionMixture'
import { getEnterConditionApi } from '@/api/competitionMixture'
import dayjs from 'dayjs'
import Sidebar from '../Sidebar/Sidebar'
import { CompetitionType, ICompetition, IGroup } from '@/vite-env'
import { Button, List, Menu, Modal, Steps, Tooltip, notification } from 'antd'
import Update from '../Update/Update'
import { getUserInfoApi } from '@/api/user'
import UserCard from '@/components/User/UserCard'
import { User } from '@/vite-env'
import CompetitionTypeLabel from '../Label.tsx/CompetitionTypeLabel'
import EnterGroup from './Group/EnterGroup'
import GroupInfo from './Group/GroupInfo'
import { getMemberGroupListApi } from '@/api/group'

type CompetitionState = 'notEnter' | 'underway' | 'enter' | 'finished'
let interval: ReturnType<typeof setInterval>

interface CountDown {
  day: string
  hour: string
  min: string
  second: string
}

const getState = (
  start: string,
  end: string,
  enter: boolean
): CompetitionState => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return enter ? 'enter' : 'notEnter'
  } else if (
    dayjs(start).valueOf() < dayjs().valueOf() &&
    dayjs(end).valueOf() > dayjs().valueOf()
  ) {
    return 'underway'
  } else return 'finished'
}

const countDownFun = (
  endTime: string,
  setcountDown: Function,
  setcompetitionState: Function
) => {
  const end = dayjs(endTime)
  const time: CountDown = {
    day: '00',
    hour: '00',
    min: '00',
    second: '00'
  }
  const fn = () => {
    const current = dayjs()
    let duration = end.unix() - current.unix()
    if (duration >= 0) {
      if (duration >= 60 * 60 * 24) {
        time.day =
          Math.floor(duration / (60 * 60 * 24)) >= 10
            ? String(Math.floor(duration / (60 * 60 * 24)))
            : `0${String(Math.floor(duration / (60 * 60 * 24)))}`
        duration = duration - 60 * 60 * 24 * Number(time.day)
      } else if (duration < 60 * 60 * 24 && duration > 60 * 60 * 23) {
        time.day = '00'
      }
      if (duration >= 60 * 60) {
        time.hour =
          Math.floor(duration / (60 * 60)) >= 10
            ? String(Math.floor(duration / (60 * 60)))
            : `0${String(Math.floor(duration / (60 * 60)))}`
        duration = duration - 60 * 60 * Number(time.hour)
      } else if (duration > 60 * 59 && duration < 60 * 60) {
        time.hour = '00'
      }
      if (duration >= 60) {
        time.min =
          Math.floor(duration / 60) >= 10
            ? String(Math.floor(duration / 60))
            : `0${String(Math.floor(duration / 60))}`
        duration = duration - 60 * Number(time.min)
      } else if (duration < 60) {
        time.min = '00'
      }
      time.second = duration >= 10 ? String(duration) : `0${String(duration)}`
    } else {
      setcompetitionState('underway')
      clearInterval(interval)
    }
    setcountDown({ ...time })
  }
  fn()
  interval = setInterval(() => {
    fn()
  }, 1000)
}

const Detail: React.FC = () => {
  const nav = useNavigate()
  const location = useLocation()
  const { competition_id } = useParams()
  const [type, settype] = useState<CompetitionType>('')
  const [current, setcurrent] = useState('')
  const [competitionState, setcompetitionState] = useState<CompetitionState>()
  const [competition, setcompetition] = useState<ICompetition>()
  const [enterNum, setenterNum] = useState()
  const [countDown, setcountDown] = useState<CountDown>()
  const [openEnterModal, setopenEnterModal] = useState(false)
  const [openUpdateModal, setopenUpdateModal] = useState(false)
  const [openEnterListModal, setopenEnterListModal] = useState(false)
  const [enterList, setenterList] = useState<User[]>([])
  const [answering, setanswering] = useState(false)
  const [groupInfo, setgroupInfo] = useState<IGroup>({} as IGroup)

  useLayoutEffect(() => {
    if (location.pathname.indexOf('problem') >= 0) {
      setanswering(
        location.pathname.slice(location.pathname.indexOf('problem') + 8)
          .length === 0
          ? false
          : true
      )
    } else setanswering(false)
  }, [])

  useEffect(() => {
    let type: CompetitionType = ''
    showCompetitionApi(competition_id as string).then(res => {
      const competition = res.data.data.competition as ICompetition
      switch (competition.type) {
        case 'Single':
          type = 'single'
          settype('single')
          break
        case 'Group':
          type = 'group'
          settype('group')
          break
        case 'Match':
          type = 'match'
          settype('match')
          break
        default:
          break
      }
      setcompetition(res.data.data.competition)
      switch (type) {
        case 'single':
          fetchSingle(competition)
          break
        case 'group':
          fetchGroup(competition)
          break
        case 'match':
          fetchMatch(competition)
          break
        default:
          break
      }
    })

    return () => {
      clearInterval(interval)
    }
  }, [])

  const fetchSingle = async (competition: ICompetition) => {
    const type = 'single'
    const result = await getEnterConditionApi(type, competition.id)
    console.log(result)
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data.enter
    )
    setcompetitionState(state)
    if (state === 'enter' || state === 'notEnter')
      countDownFun(competition.start_time, setcountDown, setcompetitionState)
    else if (state === 'underway')
      countDownFun(competition.end_time, setcountDown, setcompetitionState)
    getEnterListApi(type, competition.id).then(res => {
      setenterNum(res.data.data.total)
    })
  }

  const fetchGroup = async (competition: ICompetition) => {
    const type = 'group'
    const result = await getEnterConditionApi(type, competition.id)
    if (result.data.data) {
      const group = result.data.data.group as IGroup
      getMemberGroupListApi(group.id).then(async res => {
        const members = res.data.data.userList
        const users: User[] = []
        for (let item of members) {
          await getUserInfoApi(item.user_id).then(res => {
            users.push(res.data.data.user)
          })
        }
        Object.assign(group, {
          members: users
        })
        setgroupInfo(group)
      })
    }
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data ? true : false
    )
    setcompetitionState(state)
    if (state === 'enter' || state === 'notEnter')
      countDownFun(competition.start_time, setcountDown, setcompetitionState)
    else if (state === 'underway')
      countDownFun(competition.end_time, setcountDown, setcompetitionState)
    // getEnterListApi(type, competition.id).then(res => {
    //   setenterNum(res.data.data.total)
    // })
  }

  const fetchMatch = async (competition: ICompetition) => {
    const type = 'match'
    const result = await getEnterConditionApi(type, competition.id)
    console.log(result)
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data ? true : false
    )
    setcompetitionState(state)
  }

  const enterCompetition = () => {
    const data = {
      password: '666666'
    }
    if (competitionState === 'notEnter') {
      enterCompetitionApi(
        type,
        competition?.id as string,
        JSON.stringify(data)
      ).then(res => {
        if (res.data.code === 200) {
          setopenEnterModal(false)
          setcompetitionState('enter')
          notification.success({
            message: '报名成功',
            placement: 'topRight'
          })
        } else {
          notification.warning({
            message: res.data.msg,
            placement: 'topRight'
          })
        }
      })
    } else if (competitionState === 'enter') {
      cancelEnterApi(
        type,
        competition?.id as string,
        groupInfo.id ? groupInfo.id : ''
      ).then(res => {
        if (res.data.code === 200) {
          setopenEnterModal(false)
          setcompetitionState('notEnter')
          notification.success({
            message: '取消报名成功',
            placement: 'topRight'
          })
        } else {
          notification.warning({
            message: res.data.msg,
            placement: 'topRight'
          })
        }
      })
    }
  }

  const getEnterList = () => {
    setenterList([])
    setopenEnterListModal(true)
    getEnterListApi(type, competition?.id as string).then(res => {
      console.log('enterlist', res.data.data)
      res.data.data.competitionRanks.forEach((item: any) => {
        getUserInfoApi(item.member_id).then(result => {
          setenterList(value => [...value, result.data.data.user])
        })
      })
    })
  }

  const navTo = (e: any) => {
    setanswering(false)
    setcurrent(e.key)
    switch (e.key) {
      case 'overview':
        nav('')
        break
      case 'problem':
        nav('problem')
        break
      case 'rank':
        nav('rank')
        break
      case 'record':
        nav('record')
        break
      default:
        break
    }
  }

  return (
    <div className="max-w-screen-xl">
      {/* header */}
      <div className="rounded shadow-md p-4">
        <div className="flex">
          <div className="flex flex-col items-center justify-center">
            <svg
              onClick={() => {
                ;['notEnter', 'enter'].includes(competitionState as string)
                  ? setopenEnterModal(true)
                  : null
              }}
              className="icon-large hover:cursor-pointer"
              aria-hidden={true}
            >
              {competitionState === 'notEnter' && (
                <use href="#icon-weibaoming"></use>
              )}
              {competitionState === 'enter' && (
                <use href="#icon-yibaoming"></use>
              )}
              {competitionState === 'underway' && (
                <use href="#icon-jinhangzhong"></use>
              )}
              {competitionState === 'finished' && (
                <use href="#icon-yijieshu"></use>
              )}
            </svg>
          </div>
          <div className="flex-grow">
            <div className=" flex justify-center items-center text-3xl font-bold ">
              <CompetitionTypeLabel
                className="icon"
                showLabel={false}
                type={competition?.type as CompetitionType}
              ></CompetitionTypeLabel>
              <div className="ml-4">{competition?.title}</div>
            </div>
            <div className="flex justify-center mt-4 h-12">
              {competitionState !== 'finished' && (
                <Fragment>
                  <div className="countdown-section">
                    <span className="countdown-amount">{countDown?.day}</span>
                    {/* <span className="countdown-period">天</span> */}
                  </div>
                  <div className="countdown-section">
                    <span className="countdown-amount">{countDown?.hour}</span>
                    {/* <span className="countdown-period">时</span> */}
                  </div>
                  <div className="countdown-section">
                    <span className="countdown-amount">{countDown?.min}</span>
                    {/* <span className="countdown-period">分</span> */}
                  </div>
                  <div className="countdown-section">
                    <span className="countdown-amount">
                      {countDown?.second}
                    </span>
                    {/* <span className="countdown-period">秒</span> */}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Tooltip title="查看报名列表">
              <div
                className=" font-bold hover:cursor-pointer"
                onClick={() => getEnterList()}
              >
                {typeof enterNum === 'number' && (
                  <Fragment>
                    <div className="flex justify-center ">{enterNum}名</div>
                    <div>参赛者</div>
                  </Fragment>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <Menu
        className="my-4"
        selectedKeys={[current]}
        onClick={e => navTo(e)}
        mode="horizontal"
        items={[
          {
            key: 'overview',
            label: '总览'
          },
          {
            key: 'problem',
            label: '题目'
          },
          {
            key: 'rank',
            label: '排名'
          },
          {
            key: 'record',
            label: '提交'
          }
        ]}
      ></Menu>
      <div className="flex w-full">
        {/* content */}
        <div
          className="shadow flex-grow"
          style={{
            minWidth: '1000px'
          }}
        >
          <Outlet
            context={[competition, competitionState, setanswering, type]}
          ></Outlet>
        </div>
        {/* sidebar */}
        {!answering && (
          <Fragment>
            <div className="w-8"></div>
            <div className="shadow w-96 h-min">
              <Sidebar
                type={type}
                competition={competition}
                setopenUpdateModal={setopenUpdateModal}
              ></Sidebar>
            </div>
          </Fragment>
        )}
      </div>
      <Modal
        title={competitionState === 'notEnter' ? '报名' : '取消报名'}
        open={openEnterModal}
        onCancel={() => setopenEnterModal(false)}
        footer={[]}
      >
        {type === 'single' && (
          <Fragment>
            <div>
              {competitionState === 'notEnter' && <div>报名本个人赛？</div>}
              {competitionState === 'enter' && <div>取消报名本个人赛？</div>}
            </div>
            <div className="flex justify-center mt-8">
              <Button onClick={() => setopenEnterModal(false)}>取消</Button>
              <Button type="primary" onClick={enterCompetition}>
                确定
              </Button>
            </div>
          </Fragment>
        )}
        {type === 'group' && (
          <div>
            {competitionState === 'notEnter' && (
              <EnterGroup competition={competition} type={type}></EnterGroup>
            )}
            {competitionState === 'enter' && (
              <Fragment>
                <GroupInfo group={groupInfo}></GroupInfo>
                <div className="absolute right-8 bottom-8">
                  <Button
                    type="dashed"
                    danger
                    onClick={() => enterCompetition()}
                  >
                    取消报名
                  </Button>
                </div>
              </Fragment>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="报名列表"
        open={openEnterListModal}
        onCancel={() => setopenEnterListModal(false)}
        footer={[]}
      >
        <List
          itemLayout="horizontal"
          dataSource={enterList}
          renderItem={(item, index) => (
            <Fragment>
              <List.Item>
                <List.Item.Meta
                  title={<UserCard user={item}></UserCard>}
                ></List.Item.Meta>
              </List.Item>
            </Fragment>
          )}
        ></List>
      </Modal>

      <Update
        competition={competition}
        setcompetition={setcompetition}
        openUpdateModal={openUpdateModal}
        setopenUpdateModal={setopenUpdateModal}
      ></Update>
    </div>
  )
}

export default Detail
