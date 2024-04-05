import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Col, Divider, Statistic, Row, Space, Input, Select, Segmented } from 'antd'
import HotRank from './Overview/Side/HotRank'
import { getArticleListApi } from '@/api/article'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import myHooks from '@/tool/myHooks/myHooks'
import style from './style.module.scss'
import { getNoticeBoardListApi } from '@/api/noticeboard'
import ReadOnly from '@/components/editor/Readonly'
import { INotice } from '@/type'
import Search from 'antd/es/transfer/search'
import MySvgIcon from '@/components/Icon/MySvgIcon'

interface IStats {
  article: number
  comment: number
  solve: number
}

type Type = 'article' | 'user' | 'comment' | 'post'

const CommunityRoot: React.FC = () => {
  const nav = myHooks.useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const pathname = useRecoilValue(pathNameState)
  const [noticeList, setNoticeList] = useState<INotice[]>([])
  const [searchText, setSearchText] = useState('')
  const [type, setType] = useState<Type>('article')
  const [stats, setstats] = useState<IStats>({
    article: 0,
    comment: 0,
    solve: 0,
  })

  const showHeaderSider = useMemo(
    () => utils.getPathArray(pathname).length > 1 && utils.getPathArray(pathname)[1].includes('set'),
    [pathname]
  )

  useEffect(() => {
    if (pathname === '/community') nav('/community/articleset')
  }, [pathname])

  useEffect(() => {
    fetchNoticeList()
    fetchStats()
    window.addEventListener('popstate', fetchNoticeList)
    return () => {
      window.removeEventListener('popstate', fetchNoticeList)
    }
  }, [])

  const fetchNoticeList = async () => {
    try {
      const res = (await getNoticeBoardListApi(1, 999999)).data.data
      setNoticeList(res.notices)
    } catch {}
  }

  const fetchStats = async () => {
    const res = await Promise.all([getArticleListApi(1, 0)])
    setstats((value) => {
      return {
        ...value,
        article: res[0].data.data.total,
      }
    })
  }

  const handleSearch = () => {
    setQuerys(() => (searchText ? [['text', searchText]] : []))
  }
  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value)
  }

  return (
    <div className={style.communityRoot}>
      {/* left */}
      <div className={style.left}>
        <Input.Search
          className={style.search}
          size="large"
          defaultValue={searchText}
          placeholder="搜索用户、公告、文章、讨论、题解"
          enterButton
          onSearch={handleSearch}
          onChange={handleSearchChange}
        ></Input.Search>
        {/* 公告 */}
        {showHeaderSider && (
          <div className={style.notice}>
            {noticeList.map((item, index) => (
              <>
                {index <= 2 && (
                  <Card
                    key={index}
                    className={style.item}
                    style={{
                      marginRight: index === 2 ? '0px' : '0.5rem',
                    }}
                    styles={{
                      body: {
                        height: '6rem',
                        padding: '0px',
                        marginBottom: '1rem',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                      },
                    }}
                    title={item.title}
                    size="small"
                    hoverable
                    onClick={() => nav(`/community/notice/${item.id}`)}
                  >
                    <ReadOnly
                      style={{
                        fontSize: '0.8rem',
                      }}
                      html={item.content}
                    ></ReadOnly>
                  </Card>
                )}
              </>
            ))}
          </div>
        )}
        <Card
          className={style.recommand}
          title={
            <div className={style.title}>
              <span className="mr-2">每日推荐</span>
              <MySvgIcon href="#icon-recommand" size={2}></MySvgIcon>
            </div>
          }
          extra={
            <Segmented
              defaultValue={'article'}
              options={recommandOptions}
              onChange={(value) => setType(value as Type)}
            ></Segmented>
          }
        >
          <div className={style.content}>
            <Outlet></Outlet>
          </div>
        </Card>
      </div>
      {/* right */}
      {showHeaderSider && (
        <div className={style.right}>
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
          <Card
            size="small"
            title={
              <h3 className="">
                <span>热榜</span>
                <span>
                  <MySvgIcon href="#icon-fire" size={1.5}></MySvgIcon>
                </span>
              </h3>
            }
          >
            <HotRank type={type}></HotRank>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CommunityRoot

const recommandOptions = [
  {
    value: 'article',
    label: '文章',
  },
  {
    value: 'comment',
    label: '讨论',
  },
  {
    value: 'post',
    label: '题解',
  },
  {
    value: 'user',
    label: '用户',
  },
]
