import { getCompetitionRankListApi, getMemberRankApi } from '@/api/competition'
import { ICompetition, IRank } from '@/type'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { rollingRanklistWs } from '@/api/competition'
import { getUserInfoApi } from '@/api/user'
import NoData from '@/components/Empty/NoData'
import useWsConnect from '@/tool/myHooks/useWsConnect'
import ErrorPage from '@/components/error-page'

interface DataSource extends IRank {
  key: string
  index: number
  name: string
}

const Rank: React.FC = () => {
  const { competition_id } = useParams()
  if (!competition_id) return <ErrorPage></ErrorPage>
  const [competition] = useOutletContext<[ICompetition]>()
  const [dataSource, setdataSource] = useState<DataSource[]>([])

  useWsConnect({ wsApi: rollingRanklistWs(competition_id), onMessage: onWsMessage })

  useEffect(() => {
    fetchRankList()
  }, [])

  const fetchRankList = () => {
    getCompetitionRankListApi(competition_id as string).then(async (res) => {
      const members = res.data.data.members
      let index = 0
      for (let member of members) {
        const { data } = await getUserInfoApi(member.member_id)
        setdataSource((value) => [
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
      <Table
        dataSource={dataSource}
        locale={{
          emptyText: <NoData text='暂无数据' />
        }}
      >
        <Column
          align='center'
          dataIndex={'index'}
          title='排名'
        ></Column>

        <Column
          align='center'
          dataIndex={'name'}
          title='选手'
        ></Column>
        <Column
          align='center'
          dataIndex={'score'}
          title='得分'
        ></Column>
        <Column
          align='center'
          dataIndex={'penalties'}
          title='罚时'
        ></Column>
        <Column
          align='center'
          dataIndex={'created_at'}
          title='时间'
        ></Column>
      </Table>
    </div>
  )
}

export default Rank
