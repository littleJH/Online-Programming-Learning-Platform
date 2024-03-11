import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Divider, Statistic, Row, Space } from 'antd'
import HotRank from './Overview/Side/HotRank'
import { getArticleListApi } from '@/api/article'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import myHooks from '@/tool/myHooks/myHooks'

interface IStats {
  article: number
  comment: number
  solve: number
}

const CommunityRoot: React.FC = () => {
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const [stats, setstats] = useState<IStats>({
    article: 0,
    comment: 0,
    solve: 0,
  })

  useEffect(() => {
    if (pathname === '/community') nav('/community/articleset')
  }, [pathname])

  useEffect(() => {
    Promise.all([
      getArticleListApi(1, 0).then((res) => {
        setstats((value) => {
          return {
            ...value,
            article: res.data.data.total,
          }
        })
      }),
    ])
  }, [])

  const showHeaderSider = useMemo(
    () => utils.getPathArray(pathname).length > 1 && utils.getPathArray(pathname)[1].includes('set'),
    [pathname]
  )

  return (
    <div className="flex" style={{ width: 'min-content' }}>
      {/* left */}
      <div className="grow h-full">
        {/* 公告 */}
        {showHeaderSider && (
          <div className="w-full my-4">
            <Row gutter={16}>
              <Col span={8}>
                <Card title="公告1" size="small" hoverable>
                  公告1的内容...
                </Card>
              </Col>
              <Col span={8}>
                <Card title="公告2" size="small" hoverable>
                  公告2的内容...
                </Card>
              </Col>
              <Col span={8}>
                <Card title="公告3" size="small" hoverable>
                  公告3的内容...
                </Card>
              </Col>
            </Row>
            <Card title="全站统计">
              <Row gutter={16}>
                <Col span={4}>
                  <Statistic title="文章" value={111}></Statistic>
                </Col>
                <Col span={4}>
                  <Statistic title="讨论" value={222}></Statistic>
                </Col>
                <Col span={4}>
                  <Statistic title="题解" value={333}></Statistic>
                </Col>
                <Col span={4}>
                  <Statistic title="题目" value={444}></Statistic>
                </Col>
                <Col span={4}>
                  <Statistic title="比赛" value={555}></Statistic>
                </Col>
                <Col span={4}>
                  <Statistic title="用户" value={666}></Statistic>
                </Col>
              </Row>
            </Card>
            <Divider></Divider>
          </div>
        )}
        <div style={{ minWidth: '820px' }}>
          <Outlet></Outlet>
        </div>
      </div>
      {/* right */}
      {showHeaderSider && (
        <div
          className="mx-8"
          style={{
            width: '16rem',
          }}
        >
          <Card hoverable className="my-4 flex flex-col justify-center text-xs">
            <div className="font-medium text-base mb-2">全站统计</div>
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
          <div>
            <HotRank></HotRank>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunityRoot
