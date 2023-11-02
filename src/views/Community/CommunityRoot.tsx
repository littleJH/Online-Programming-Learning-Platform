import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Col, Menu, Row, Space } from 'antd'
import HotRank from './Overview/Side/HotRank'
import { getArticleListApi } from '@/api/article'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import { getPathArray } from '@/tool/MyUtils/utils'
import useNavTo from '@/tool/myHooks/useNavTo'

interface IStats {
  article: number
  comment: number
  solve: number
}

const CommunityRoot: React.FC = () => {
  const nav = useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const [stats, setstats] = useState<IStats>({
    article: 0,
    comment: 0,
    solve: 0
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
            article: res.data.data.total
          }
        })
      })
    ])
  }, [])

  const showHeaderSider = useMemo(() => getPathArray(pathname).length > 1 && getPathArray(pathname)[1].includes('set'), [pathname])

  return (
    <>
      <div
        className='flex'
        // style={{ width: '1024px' }}
      >
        {/* left */}
        <div
          className='grow  h-full'
          style={{ width: '512px' }}
        >
          {/* 公告 */}
          {showHeaderSider && (
            <div
              className='w-full mt-4'
              style={{
                height: '130px'
              }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Card
                    title='公告1'
                    bordered={false}
                    hoverable
                  >
                    公告1的内容...
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title='公告2'
                    bordered={false}
                    hoverable
                  >
                    公告2的内容...
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title='公告3'
                    bordered={false}
                    hoverable
                  >
                    公告3的内容...
                  </Card>
                </Col>
              </Row>
            </div>
          )}
          <Outlet></Outlet>
        </div>
        {/* right */}
        {showHeaderSider && (
          <div
            className='mx-8'
            style={{
              width: '16rem'
            }}
          >
            <div
              className='my-4 px-6 shadow rounded   flex flex-col justify-center text-xs'
              style={{
                height: '130px'
              }}
            >
              <div className='font-medium text-base mb-2'>全站统计</div>
              <Space size={'large'}>
                <Space
                  size={6}
                  direction='vertical'
                >
                  <div>文章：{stats?.article}</div>
                  <div>讨论：10154</div>
                  <div>题解：1325</div>
                </Space>
                <Space
                  size={6}
                  direction='vertical'
                >
                  <div>题目：{stats?.article}</div>
                  <div>比赛：10154</div>
                  <div>用户：1325</div>
                </Space>
              </Space>
            </div>
            <div>
              <HotRank></HotRank>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CommunityRoot
