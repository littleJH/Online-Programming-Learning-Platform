import { getCompetitionRankListApi, getMemberRankApi } from '@/api/competition'
import { ICompetition, IRank } from '@/type'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { rollingRanklistWs } from '@/api/competition'
import { getUserInfoApi } from '@/api/user'
import NoData from '@/components/empty/NoData'

interface DataSource extends IRank {
  key: string
  index: number
  name: string
}

let ws: WebSocket

const Rank: React.FC = () => {
  const { competition_id } = useParams()
  const [competition] = useOutletContext<[ICompetition]>()
  const [rankList, setrankList] = useState<IRank[]>([])
  const [dataSource, setdataSource] = useState<DataSource[]>([])
  // const socket = useMemo(() => {
  //   return new WebSocket(
  //     `ws://10.60.37.43:2000/competition/rolling/list/${competition_id}`
  //   )
  // }, [competition_id])

  useEffect(() => {
    getCompetitionRankListApi(competition_id as string)
      .then(res => {
        console.log('competitionRank', res)
        return res.data.data.members
      })
      .then(async (members: IRank[]) => {
        setrankList(members)
        let index = 0
        for (let member of members) {
          const { data } = await getUserInfoApi(member.member_id)
          setdataSource(value => [
            ...value,
            Object.assign(
              {
                key: member.member_id,
                name: data.data.user.name,
                index: value.length ? value[value.length - 1].index + 1 : 1
              },
              member
            )
          ])
        }
      })
    openConnect()
    return () => {
      closeConnnect()
    }
  }, [])

  const openConnect = () => {
    ws = rollingRanklistWs(competition_id as string)
    ws.onopen = e => console.log('Connection open...')
    ws.onmessage = e => receiveData(e)
    ws.onclose = e => console.log('Connection Closed...')
  }

  const closeConnnect = () => {
    ws.close()
  }

  const receiveData = (e: MessageEvent) => {}

  return (
    <div>
      <Table
        dataSource={dataSource}
        locale={{
          emptyText: <NoData text="暂无数据" />
        }}
      >
        <Column align="center" dataIndex={'index'} title="排名"></Column>

        <Column align="center" dataIndex={'name'} title="选手"></Column>
        <Column align="center" dataIndex={'score'} title="得分"></Column>
        <Column align="center" dataIndex={'penalties'} title="罚时"></Column>
        <Column align="center" dataIndex={'created_at'} title="时间"></Column>
      </Table>
    </div>
  )
}

export default Rank
