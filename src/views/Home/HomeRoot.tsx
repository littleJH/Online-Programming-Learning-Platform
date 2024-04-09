import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Divider, Segmented, Space, theme } from 'antd'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { sideBarTypeState, userInfoState } from '@/store/appStore'
import style from './style.module.scss'
import { MessageOutlined, TrophyOutlined, GlobalOutlined, CodeOutlined } from '@ant-design/icons'
import NavgationCard from '@/components/Card/NavgationCard'
import myHooks from '@/tool/myHooks/myHooks'
import GeneralRank from '@/components/Rank/GeneralRank'
import { getCurrentUserinfo, getUserRankApi } from '@/api/user'

export default function Homepage() {
  const setSidebarType = useSetRecoilState(sideBarTypeState)
  const currentUser = useRecoilValue(userInfoState)
  const [rankList, setRankList] = useState([])
  const { token } = theme.useToken()
  const nav = myHooks.useNavTo()

  useEffect(() => {
    setSidebarType('none')
    fetchRankList()
  }, [])

  const fetchRankList = async () => {
    try {
      const res = await getUserRankApi()
      setRankList(res.data.data.users || [])
    } catch {}
  }

  const navItems = [
    {
      title: '在线评测',
      content: '挑战自己，提升编程技能',
      icon: (
        <CodeOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/problemset/all',
    },
    {
      title: '竞赛切磋',
      content: '参与竞赛，展示你的实力',
      icon: (
        <TrophyOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/competition/common/set',
    },
    {
      title: '即时通讯',
      content: '与志同道合的编程爱好者交流',
      icon: (
        <MessageOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/profile/group',
    },
    {
      title: '知识分享',
      content: '分享经验，造福他人',
      icon: (
        <GlobalOutlined
          style={{
            color: token.colorPrimary,
            fontSize: '2rem',
          }}
        />
      ),
      path: '/community/articleset',
    },
  ]
  return (
    <div className={style.homeRoot}>
      <div className={style.left}>
        <header className={style.header}>
          <h1>DOJ - 编程学习平台</h1>
          <p>解锁编程的奥秘，与世界分享你的想法</p>
          <img></img>
        </header>

        <section className="">
          <div className={style.navCard}>
            {navItems.map((item, index) => (
              <div className={style.item}>
                <NavgationCard
                  key={index}
                  title={item.title}
                  content={item.content}
                  icon={item.icon}
                  path={item.path}
                ></NavgationCard>
              </div>
            ))}
          </div>
        </section>
        <footer></footer>
      </div>
      <div className={style.right}>
        <div className={style.rankBox}>
          <GeneralRank
            title="今日排行"
            rankList={[]}
            // extra={<Segmented options={['']}></Segmented>}
            onClick={() => {}}
          ></GeneralRank>
        </div>
      </div>
    </div>
  )
}
