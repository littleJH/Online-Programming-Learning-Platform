import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Avatar, Button, List, Modal, notification } from 'antd'
import {
  enterRandomCompetitionApi,
  getRandomEnterConditionApi,
  enterPublishWs,
  cancelEnterRandomCompetitionApi,
  getEnterRandomCompetitionListApi
} from '@/api/CompetitionRandom'
import { useParams } from 'react-router-dom'
import { CompetitionType, User } from '@/vite-env'
import dayjs from 'dayjs'
import { getCurrentUserinfo, getUserInfoApi } from '@/api/user'
import style from './style.module.scss'

type State = 'enter' | 'notEnter' | 'undetermined'

interface Member {
  enter_time: string
  member: User
}

let ws: WebSocket

let firstAddMove = true
let ctnHeight: number, ctnWidth: number
let intervals: ReturnType<typeof setInterval>[] = []

const addMove = (index: number) => {
  const element = document.querySelector(`#avatar${index}`) as HTMLElement
  element.classList.add('absolute')
  element.style.transition = 'all 1s linear'

  element.style.top = '0px'
  element.style.left = '0px'
  const fn = () => {
    const top = Math.floor(Math.random() * 200 - 100)
    const left = Math.floor(Math.random() * 200 - 100)
    const topNum = Number(
      element.style.top.slice(0, element.style.top.indexOf('px'))
    )
    const leftNum = Number(
      element.style.left.slice(0, element.style.left.indexOf('px'))
    )

    element.style.top =
      topNum + top <= ctnHeight - element.clientHeight && topNum + top >= 0
        ? `${topNum + top}px`
        : `${topNum - top}px`
    element.style.left =
      leftNum + left <= ctnWidth - element.clientWidth && leftNum + left >= 0
        ? `${leftNum + left}px`
        : `${leftNum - left}px`
  }
  fn()
  intervals.push(setInterval(fn, 1000))
}

const removeMove = (index: number) => {
  clearInterval(intervals[index])
}

const CompetitionRandom: React.FC = () => {
  const { competition_type } = useParams()
  const [enterCondition, setenterCondition] = useState<State>('undetermined')
  const [type, settype] = useState<CompetitionType>(
    competition_type as CompetitionType
  )
  const [memberList, setmemberList] = useState<Member[]>([])
  const memberListRef = useRef<Member[]>([])
  const matchContainer = useRef(null)

  useEffect(() => {
    getCurrentUserinfo().then(res => {
      console.log(res.data.data.user.name)
    })
    getRandomEnterConditionApi(type).then(res => {
      setenterCondition(res.data.data.enter ? 'enter' : 'notEnter')

      if (res.data.data.enter) {
        openConnect()
        initMemberList()
      }
    })
    return () => {
      closeConnnect()
      intervals.forEach(item => {
        clearInterval(item)
      })
    }
  }, [type])

  useEffect(() => {
    memberListRef.current = memberList
    console.log(memberListRef.current)
    if (matchContainer.current) {
      const container = matchContainer.current as HTMLElement
      ctnHeight = container.clientHeight
      ctnWidth = container.clientWidth
    }
    if (memberListRef.current.length) {
      if (firstAddMove) {
        memberListRef.current.forEach((item, index) => {
          addMove(index)
        })
        firstAddMove = false
      } else {
        addMove(memberListRef.current.length - 1)
      }
    }
  }, [memberList])

  const initMemberList = () => {
    getEnterRandomCompetitionListApi(type).then(async res => {
      const competitionRanks = res.data.data.competitionRanks
      const list = []
      for (let item of competitionRanks) {
        const user = await getUserInfoApi(item.Member)
        list.push({
          enter_time: dayjs.unix(item.Score).format().toString(),
          member: user.data.data.user
        })
      }
      setmemberList([...list])
    })
  }

  const enterCompetition = () => {
    enterRandomCompetitionApi(type).then(res => {
      if (res.data.code === 200) {
        setenterCondition('enter')

        initMemberList()
        openConnect()
      }
    })
  }

  const cancelEnter = () => {
    cancelEnterRandomCompetitionApi(type).then(res => {
      if (res.data.code === 200) {
        firstAddMove = true
        setenterCondition('notEnter')
        closeConnnect()
        setmemberList([])
        intervals.forEach(item => {
          clearInterval(item)
        })
      }
    })
  }

  const openConnect = () => {
    ws = enterPublishWs()
    ws.onopen = e => console.log('Connection open...')
    ws.onmessage = e => receiveData(e)
    ws.onclose = e => console.log('Connection Closed...')
  }

  const closeConnnect = () => {
    ws.close()
  }

  const receiveData = (e: MessageEvent) => {
    const message = JSON.parse(e.data)
    switch (message.Score) {
      case 0:
        const index = memberListRef.current.findIndex(item => {
          return item.member.id === message.Member
        })
        setmemberList(value => {
          let list = [...value]
          list.splice(index, 1)
          return list
        })
        removeMove(index)
        break
      case -1:
        break
      default:
        getUserInfoApi(message.Member).then(res => {
          setmemberList(value => [
            ...value,
            {
              enter_time: dayjs.unix(message.Score).format().toString(),
              member: res.data.data.user
            }
          ])
        })
        break
    }
  }
  return (
    <div className="center">
      {enterCondition === 'notEnter' && (
        <Button size="large" onClick={enterCompetition}>
          进入比赛
        </Button>
      )}
      {enterCondition === 'enter' && (
        <div className="center">
          <div
            ref={matchContainer}
            style={{
              height: '500px',
              width: '800px'
            }}
            className="flex justify-center items-center shadow-lg rounded"
          >
            <div className="flex-grow h-full">
              <div className="max-w-min relative">
                {memberList.map((item, index) => (
                  <div
                    id={`avatar${index}`}
                    key={item.member.id}
                    className="rounded-full "
                  >
                    <Avatar
                      size={60}
                      src={`http://img.mgaronya.com/${item.member.icon}`}
                    ></Avatar>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-28 flex justify-center items-center">
                <svg className={`${style.rotate}`}>
                  <use href="#icon-pipei"></use>
                </svg>
                {/* <Avatar
                  className={`${style.rotate}`}
                  size={100}
                  src={`http://img.mgaronya.com/${selfInfo.icon}`}
                ></Avatar> */}
              </div>
              <Button
                style={{
                  width: '6rem'
                }}
                type="dashed"
                onClick={() => {
                  cancelEnter()
                }}
              >
                取消匹配
              </Button>
            </div>
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
