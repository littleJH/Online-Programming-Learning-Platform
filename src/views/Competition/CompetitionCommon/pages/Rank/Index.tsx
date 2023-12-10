import {getCompetitionRankListApi, getMemberRankApi} from '@/api/competition'
import {ICompetition} from '@/type'
import {Space, Table, theme} from 'antd'
import React, {useEffect, useMemo, useState} from 'react'
import {useOutletContext, useParams} from 'react-router-dom'
import {rollingRanklistWs} from '@/api/competition'
import {getUserInfoApi} from '@/api/user'
import useWsConnect from '@/tool/myHooks/useWsConnect'
import ErrorPage from '@/components/error-page'
import RollList from '@/components/List/RollList'
import {useRecoilValue} from 'recoil'
import {currentCompetitionAtom} from '@/views/Competition/competitionStore'

interface IRank {
  id: string | number
  index: number
  name: string
  score: number
  penalties: string
  created_at: string
}

let interval: NodeJS.Timeout

const Rank: React.FC = () => {
  const competition = useRecoilValue(currentCompetitionAtom)
  const [rankList, setRankList] = useState<IRank[]>([])
  const {token} = theme.useToken()
  const spanClass = ''

  // useWsConnect({
  //   wsApi: rollingRanklistWs(competition_id),
  //   onMessage: onWsMessage,
  // })

  useEffect(() => {
    initRankList()
  }, [competition])

  // useEffect(() => {
  //   interval = setInterval(() => changeRank(), 1000)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  useEffect(() => {
    console.log('list change ==> ', rankList)
  }, [rankList])

  // const initRankList = () => {
  //   const list: IRank[] = []
  //   for (let i = 0; i < 10; i++) {
  //     list.push({
  //       id: Math.floor(Math.random() * 10000000),
  //       index: i,
  //       name: 'name' + i,
  //       score: i * 10,
  //       penalties: String(i * 10),
  //       created_at: new Date().toLocaleDateString() + ''
  //     })
  //   }
  //   setRankList(list)
  // }

  const changeRank = () => {
    if (rankList.length > 0) {
      const index = Math.floor(Math.random() * 10)
      const list = [...rankList]
      list[index - 1].score = Math.floor(Math.random() * 10)
      list[index - 1].id = Math.floor(Math.random() * 10000000)
      list.sort((a, b) => b.score - a.score)
      setRankList(list)
    }
  }

  const initRankList = () => {
    competition &&
      getCompetitionRankListApi(competition.id).then(async (res) => {
        const members = res.data.data.members
        for (let member of members) {
          const {data} = await getUserInfoApi(member.member_id)
          setRankList((value) => [
            ...value,
            {
              ...member,
              key: member.member_id,
              name: data.data.user.name,
              index: value.length ? value[value.length - 1].index + 1 : 1
            }
          ])
        }
      })
  }

  function onWsMessage(message: any) {}

  return (
    <div>
      {rankList && (
        <RollList
          list={rankList}
          renderItem={(item, index) => (
            <div
              key={item.ix}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 2rem',
                height: '3rem',
                borderBottom: index !== rankList.length - 1 ? '1px solid' : '',
                borderColor: token.colorBorder
              }}>
              <span className={spanClass}>{index}</span>
              <span className={spanClass}>{item.name}</span>
              <span className={spanClass}>{item.score}</span>
              <span className={spanClass}>{item.penalties}</span>
              <span className={spanClass}>{item.created_at}</span>
            </div>
          )}></RollList>
      )}
    </div>
  )
}

export default Rank
