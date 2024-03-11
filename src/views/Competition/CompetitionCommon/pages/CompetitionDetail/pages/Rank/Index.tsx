import { getCompetitionRankListApi, getMemberRankApi } from '@/api/competition'
import { theme } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { rollingRanklistWs } from '@/api/competition'
import { getUserInfoApi } from '@/api/user'
import myHooks from '@/tool/myHooks/myHooks'
import RollList from '@/components/List/RollList'
import { useRecoilValue } from 'recoil'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'

interface IRank {
  id: string | number
  index: number
  name: string
  score: number
  penalties: string
  created_at: string
}

let interval: NodeJS.Timeout

const Rank: React.FC<{ mode?: 'default' | 'sider' }> = (props) => {
  const { mode = 'default' } = props
  const competition = useRecoilValue(currentCompetitionAtom)
  const [rankList, setRankList] = useState<IRank[]>([])
  const { token } = theme.useToken()
  const spanClass = `${mode === 'default' ? 'w-1/5' : 'w-1/3'} text-center`

  myHooks.useWsConnect({
    wsApi: competition?.id ? rollingRanklistWs(competition.id) : null,
    onMessage: onWsMessage,
  })

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
    console.log('rank list change ==> ', rankList)
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
          const { data } = await getUserInfoApi(member.member_id)
          setRankList((value) => [
            ...value,
            {
              ...member,
              key: member.member_id,
              name: data.data.user.name,
              index: value.length ? value[value.length - 1].index + 1 : 1,
            },
          ])
        }
      })
  }

  function onWsMessage(message: any) {
    console.log('onRankWsMessage', message)
  }

  return (
    <div className="w-full">
      {mode === 'sider' && (
        <>
          <p className="flex justify-center items-center">实时排名</p>
          <p className="flex">
            <span className={spanClass}>排名</span>
            <span className={spanClass}>名称</span>
            <span className={spanClass}>分数</span>
          </p>
        </>
      )}

      {rankList && (
        <RollList
          list={rankList}
          renderItem={(item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                width: '100%',
                height: '3rem',
                borderBottom: index !== rankList.length - 1 ? '1px solid' : '',
                borderColor: token.colorBorder,
                color: token.colorTextBase,
                backgroundColor: token.colorBgBase,
              }}
            >
              <span className={spanClass}>{index + 1}</span>
              <span className={spanClass}>{item.name}</span>
              <span className={spanClass}>{item.score}</span>
              {mode === 'default' && <span className={spanClass}>{item.penalties}</span>}
              {mode === 'default' && <span className={spanClass}>{item.created_at}</span>}
            </div>
          )}
        ></RollList>
      )}
    </div>
  )
}

export default Rank
