import { Card, Space, Statistic } from 'antd'
import React from 'react'

interface IStats {
  article: number
  comment: number
  solve: number
}

const CommunityStatistic: React.FC<{ stats: IStats }> = (props) => {
  const { stats } = props
  return (
    <Card size="small" title={'全站统计'} hoverable className="mb-4 flex flex-col justify-center text-xs">
      <Statistic></Statistic>
      <Space size={'large'}>
        <Space size={6} direction="vertical">
          <div>文章：{stats?.article}</div>
          <div>讨论：10154</div>
          <div>题解：1325</div>
        </Space>
        <Space size={6} direction="vertical">
          <div>题目：{stats?.article}</div>
          <div>比赛：10154</div>
          <div>用户：1325</div>
        </Space>
      </Space>
    </Card>
  )
}

export default CommunityStatistic
