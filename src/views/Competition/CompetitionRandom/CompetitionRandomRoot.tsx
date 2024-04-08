import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Alert, Avatar, Button, List, Modal, Spin, notification, theme } from 'antd'
import {
  enterRandomCompetitionApi,
  getRandomEnterConditionApi,
  enterPublishWs,
  cancelEnterRandomCompetitionApi,
  getEnterRandomCompetitionListApi,
  getCompetitionRandomEnterPublishWs,
} from '@/api/CompetitionRandom'
import { useParams, useSearchParams } from 'react-router-dom'
import { CompetitionType, User } from '@/type'
import dayjs from 'dayjs'
import { getCurrentUserinfo, getUserInfoApi } from '@/api/user'
import style from '@/views/Competition/style.module.scss'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import MyAvatar from '@/components/Avatar/MyAvatar'
import myHooks from '@/tool/myHooks/myHooks'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'

type State = 'enter' | 'notEnter' | 'undetermined'

interface Member {
  enter_time: string
  member: User
}

let intervalsMap = new Map<string, ReturnType<typeof setInterval>>([])

const addMove = (id: string) => {
  if (intervalsMap.has(id)) return
  const element = document.querySelector(`#avatar${id}`) as HTMLElement
  const container = document.getElementById('matchContainer') as HTMLElement
  if (!element || !container) return

  let isStop = false
  const timeInterval = 1000 / 60
  let baseSpead = 3
  let speadX = 2 * (Math.random() - 0.5) * baseSpead
  let speadY = 2 * (Math.random() - 0.5) * baseSpead

  let xPosition = Math.random() * (container.clientWidth - element.clientWidth)
  let yPosition = Math.random() * (container.clientHeight - element.clientHeight)

  const ctnHeight = container.clientHeight
  const ctnWidth = container.clientWidth
  const elementHeight = element.clientHeight
  const elementWidth = element.clientWidth

  element.addEventListener('mouseenter', () => (isStop = true))
  element.addEventListener('mouseleave', () => (isStop = false))

  const updatePosition = () => {
    if (isStop) return
    xPosition += speadX
    yPosition += speadY

    if (xPosition < 0 || xPosition + elementWidth > ctnWidth) {
      speadX = -speadX
    }
    if (yPosition < 0 || yPosition + elementHeight > ctnHeight) {
      speadY = -speadY
    }

    element.style.opacity = '1'
    element.style.left = `${xPosition}px`
    element.style.top = `${yPosition}px`
  }
  intervalsMap.set(id, setInterval(updatePosition, timeInterval))
}

const removeMove = (id?: string) => {
  if (typeof id === 'number') {
    clearInterval(intervalsMap.get(id))
    intervalsMap.delete(id)
  } else {
    intervalsMap.forEach((value) => clearInterval(value))
    intervalsMap.clear()
  }
}

const CompetitionRandom: React.FC = () => {
  const [querys, setQuerys] = useSearchParams()
  const notification = useRecoilValue(notificationApi)
  const [type, setType] = useState(querys.get('type') || 'single')
  const [enterCondition, setenterCondition] = useState<State>('undetermined')
  const [connecting, setConnecting] = useState(false)
  const [memberList, setmemberList] = useState<Member[]>([])
  const memberListRef = useRef<Member[]>([])
  const matchContainer = useRef(null)
  const { token } = theme.useToken()

  const { connectWs, closeWs } = myHooks.useWsConnect({
    wsUrl: getCompetitionRandomEnterPublishWs(),
    onMessage: (message) => receiveData(message),
    onOpen: () => setConnecting(true),
    onClose: () => setConnecting(false),
    // onTimeout: (retryTime: number) => handleTimeout(retryTime),
    onFail: () => cancelEnter(),
    immediately: false,
  })

  useEffect(() => {
    getIsEnter()
    return () => {
      closeWs()
      cancelEnter()
    }
  }, [type])

  useEffect(() => {
    memberListRef.current = memberList
    memberListRef.current.length &&
      memberListRef.current.forEach((item, index) => {
        addMove(item.member.id)
      })
  }, [memberList])

  const getIsEnter = async () => {
    const res = await getRandomEnterConditionApi(type)
    setenterCondition(res.data.data.enter ? 'enter' : 'notEnter')
    if (res.data.data.enter) {
      connectWs()
      initMemberList()
    }
  }

  const initMemberList = async () => {
    const res = await getEnterRandomCompetitionListApi(type)
    const competitionRanks = res.data.data.competitionRanks
    const list = []
    for (let item of competitionRanks) {
      const user = await getUserInfoApi(item.Member)
      list.push({
        enter_time: dayjs.unix(item.Score).format().toString(),
        member: user.data.data.user,
      })
    }
    setmemberList(list)
  }

  const enterCompetition = async () => {
    const res = await enterRandomCompetitionApi(type)
    if (res.data.code === 200) {
      setenterCondition('enter')
      initMemberList()
      connectWs()
    }
  }

  const cancelEnter = async () => {
    closeWs()
    const res = await cancelEnterRandomCompetitionApi(type)
    if (res.data.code === 200) {
      setenterCondition('notEnter')
      setmemberList([])
      removeMove()
    }
  }

  const receiveData = (message: any) => {
    switch (message.Score) {
      // 用户退出
      case 0:
        const index = memberListRef.current.findIndex((item) => item.member.id === message.Member)
        setmemberList((value) => [...value.slice(0, index), ...value.slice(index + 1)])
        removeMove(memberListRef.current.find((item) => item.member.id === message.Member)?.member.id)
        break
      // 比赛开始
      case -1:
        break
      // score 报名时间
      default:
        getUserInfoApi(message.Member).then((res) => {
          setmemberList((value) => [
            ...value,
            {
              enter_time: dayjs.unix(message.Score).format().toString(),
              member: res.data.data.user,
            },
          ])
        })
        break
    }
  }

  // const handleTimeout = (retryTime: number) => {
  //   notification &&
  //     notification.warning({
  //       message: '连接超时',
  //       description: `正在为您第${retryTime + 1}次重连中 ...`,
  //       duration: 2,
  //     })
  // }

  return (
    <div className={style.randomRoot}>
      {enterCondition === 'notEnter' && (
        <div className={style.enterButton}>
          <Button
            className={style.button}
            icon={<MySvgIcon href="#icon-pipei" color={token.colorPrimary} size={4} classname={style.icon}></MySvgIcon>}
            size="large"
            onClick={enterCompetition}
          >
            进入比赛
          </Button>
        </div>
      )}
      {enterCondition === 'enter' && (
        <div className={style.matchBox}>
          <div ref={matchContainer} id="matchContainer" className={style.matchCtn}>
            {/* left */}
            <div className="flex-grow h-full">
              <div className={style.memberList}>
                {memberList.map((item, index) => (
                  <div
                    id={`avatar${item.member.id}`}
                    key={item.member.id + String(index)}
                    className={style.memberItem}
                    // onMouseEnter={() => handleMousEnter(index)}
                    // onMouseLeave={() => handleMouseLeave(index)}
                  >
                    <MyAvatar size={60} user={item.member} active></MyAvatar>
                  </div>
                ))}
              </div>
            </div>
            {/* center */}
            <div className="flex flex-col items-center">
              <div className="h-full flex justify-center items-center">
                <MySvgIcon href="#icon-pipei" classname={style.rotate} color={token.colorPrimary} size={5}></MySvgIcon>
                {/* <Spin indicator={<MySvgIcon href="#icon-pipei" color={token.colorPrimary} size={5}></MySvgIcon>}></Spin> */}
                {/* <Spin></Spin> */}
                {/* <Avatar
                  className={`${style.rotate}`}
                  size={100}
                  src={`http://img.mgaronya.com/${selfInfo.icon}`}
                ></Avatar> */}
              </div>
              <Button
                style={{
                  width: '6rem',
                  marginTop: '2rem',
                }}
                type="primary"
                onClick={() => {
                  cancelEnter()
                }}
              >
                取消匹配
              </Button>
            </div>
            {/* right */}
            <div className="flex-grow h-full"></div>
          </div>
          {/* 
          <List
            className="mx-4"
            dataSource={memberList}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={<div>{item.member.name}</div>}
                  description={<div>{item.enter_time}</div>}
                ></List.Item.Meta>
              </List.Item>
            )}
          ></List> */}
        </div>
      )}
    </div>
  )
}

export default CompetitionRandom
