import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Card, Col, Divider, Statistic, Row, Space, Input, Select, Segmented, theme } from 'antd'
import CommunityHotRank from './components/Side/CommunityHotRank'
import { getArticleListApi } from '@/api/article'
import { useRecoilState, useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import myHooks from '@/tool/myHooks/myHooks'
import style from './style.module.scss'
import { getNoticeBoardListApi } from '@/api/noticeboard'
import ReadOnly from '@/components/editor/Readonly'
import { INotice } from '@/type'
import Search from 'antd/es/transfer/search'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { siderNodeState } from './communityStore'
import CommunityStatistic from './components/Side/CommunityStatistic'

interface IStats {
  article: number
  comment: number
  solve: number
}

type Type = 'articleset' | 'userset' | 'commentset' | 'postset'

const CommunityRoot: React.FC = () => {
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const [noticeList, setNoticeList] = useState<INotice[]>([])
  const [showAllNotice, setShowAllNotice] = useState(false)
  const [siderNode, setSiderNode] = useRecoilState(siderNodeState)
  const [searchText, setSearchText] = useState(utils.getQuerys(location.search)?.text || '')
  const [stats, setstats] = useState<IStats>({
    article: 0,
    comment: 0,
    solve: 0,
  })
  const { token } = theme.useToken()

  const type = useMemo(() => utils.getPathArray(pathname)[1], [pathname])

  const visibleNotice = useMemo(
    () => (showAllNotice ? noticeList : noticeList.slice(0, 3)),
    [noticeList, showAllNotice]
  )

  const showHeaderSider = useMemo(
    () => utils.getPathArray(pathname).length > 1 && utils.getPathArray(pathname)[1].includes('set'),
    [pathname]
  )

  useEffect(() => {
    if (pathname === '/community') nav('/community/articleset')
    onPopState()
  }, [pathname])

  useEffect(() => {
    fetchStats()
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  const onPopState = () => {
    const isSet = utils.getPathArray(pathname).length > 1 && utils.getPathArray(pathname)[1].includes('set')
    isSet && setSiderNode(renderSider())
    fetchNoticeList()
  }
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

  const handleSearch = (value: string) => {
    setSearchText(value)
    nav(`/community/${utils.getPathArray(pathname)[1]}?text=${value}`)
  }
  const handleSearchChange = (e: any) => {
    if (e.target.value === '') {
      nav(`/community/${utils.getPathArray(pathname)[1]}`)
      setSearchText('')
    }
  }

  const handleSegmentedChange = (value: string) => {
    nav(`/community/${value}`)
  }

  const renderSider = () => {
    return (
      <>
        <CommunityStatistic stats={stats}></CommunityStatistic>
        <CommunityHotRank type={type as Type}></CommunityHotRank>
      </>
    )
  }

  return (
    <div className={style.communityRoot}>
      {/* left */}
      <div className={style.left}>
        {showHeaderSider && (
          <Input.Search
            className={style.search}
            size="large"
            defaultValue={searchText}
            placeholder="搜索用户、公告、文章、讨论、题解"
            enterButton
            onSearch={handleSearch}
            onChange={handleSearchChange}
          ></Input.Search>
        )}
        {/* 公告 */}
        {showHeaderSider && (
          <div className={style.notice}>
            {visibleNotice.map((item, index) => (
              <div
                className={style.item}
                style={{
                  marginRight: index === 2 ? '0px' : '1rem',
                }}
                key={index}
              >
                <Card
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
              </div>
            ))}
          </div>
        )}

        {showHeaderSider ? (
          <Card
            className={style.recommand}
            title={
              <div className={style.title}>
                <MySvgIcon
                  color={searchText === '' ? '' : token.colorPrimary}
                  href={`${searchText === '' ? 'recommand' : 'search'}`}
                  size={2}
                ></MySvgIcon>
                <span className="ml-2">{searchText === '' ? '每日推荐' : `搜索结果：${searchText}`}</span>
              </div>
            }
            extra={
              <Segmented defaultValue={type} options={recommandOptions} onChange={handleSegmentedChange}></Segmented>
            }
          >
            <div className={style.content}>
              <Outlet></Outlet>
            </div>
          </Card>
        ) : (
          <div className={style.content}>
            <Outlet></Outlet>
          </div>
        )}
      </div>
      {/* right */}
      {siderNode && <div className={style.right}>{siderNode}</div>}
    </div>
  )
}

export default CommunityRoot

const recommandOptions = [
  {
    key: 'articleset',
    value: 'articleset',
    label: '文章',
  },
  {
    key: 'commentset',
    value: 'commentset',
    label: '讨论',
  },
  {
    key: 'postset',
    value: 'postset',
    label: '题解',
  },
  {
    key: 'userset',
    value: 'userset',
    label: '用户',
  },
]
