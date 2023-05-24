import { getCompetitionRankListApi, getMemberRankApi } from '@/api/competition'
import { ICompetition, IRank } from '@/vite-env'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

interface DataSource extends IRank {
  key: string
}

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
    getCompetitionRankListApi(competition_id as string).then(res => {
      console.log('competitionRank', res)
      setrankList(res.data.data.members)
      res.data.data.members.forEach((item: IRank, index: number) => {
        setdataSource(value => [
          ...value,
          Object.assign(
            { key: res.data.data.members[index].member_id },
            res.data.data.members
          )
        ])
      })
    })
    const socket = new WebSocket(
      `ws://10.60.37.43:2000/competition/rolling/list/${competition_id}`
    )
    socket.onopen = e => {
      console.log('Connection open...')
      socket.send('hello')
    }
    socket.onmessage = e => {
      console.log('Received Message : ' + e.data)
    }
    socket.onclose = e => {
      console.log('Connection Closed...')
    }
  }, [])

  return (
    <div>
      <Table dataSource={dataSource}>
        <Column align="center" dataIndex={'member_id'} title="选手"></Column>
        <Column align="center" dataIndex={'score'} title="得分"></Column>
        <Column align="center" dataIndex={'penalties'} title="罚时"></Column>
        <Column align="center" dataIndex={'create_at'} title="时间"></Column>
      </Table>
    </div>
  )
}

export default Rank
