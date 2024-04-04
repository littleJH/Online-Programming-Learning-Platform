import { Space, Card, theme } from 'antd'
import React, { useEffect } from 'react'
import myHooks from '@/tool/myHooks/myHooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import StayTuned from '@/components/Empty/StayTuned'
import style from '../style.module.scss'
import utils from '@/tool/myUtils/utils'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { isMobileAtom } from '@/store/appStore'
// import { sideBarCollapsed } from '@/store/appStore'

const CreationNavgation: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const nav = myHooks.useNavTo()
  const { token } = theme.useToken()
  // const setSideBarCollapsed = useSetRecoilState(sideBarCollapsed)

  const handleClick = (e: string) => {
    nav(`${e}`)
    // setSideBarCollapsed(false)
  }

  const items = [
    {
      title: '题目',
      content: '点此创建题目',
      svgHref: 'problem',
      path: 'problem',
    },
    {
      title: '题单',
      content: '点此创建题单',
      svgHref: 'topic',
      path: 'topic',
    },
    {
      title: '表单',
      content: '点此创建表单',
      svgHref: 'liebiaoqingdan',
      path: 'form',
    },
    {
      title: '文章',
      content: '点此创建文章',
      svgHref: 'article',
      path: 'article',
    },
    {
      title: '讨论',
      content: '点此创建讨论',
      svgHref: 'discuss',
      path: 'comment',
    },
    {
      title: '题解',
      content: '点此创建题解',
      svgHref: 'post',
      path: 'post',
    },
    {
      title: '比赛',
      content: '点此创建比赛',
      svgHref: 'competition',
      path: 'competition/declare',
    },
    {
      title: null,
    },
  ]

  return (
    <div className={style.navgationBox}>
      <div className={style.gridLine}>
        {items.map((item, index) => (
          <Card
            classNames={{
              body: style.cardBody,
            }}
            id={item.path}
            className={style.item}
            onClick={() => item.path && handleClick(item.path)}
            hoverable
          >
            {item.title ? (
              <Space key={index} direction="vertical" className={style.navCard}>
                <div className={style.icon}>
                  <MySvgIcon href={item.svgHref} size={2}></MySvgIcon>
                </div>
                <div className={style.title}>{item.title}</div>
                {/* {!isMobile && ( */}
                <div
                  className={style.desc}
                  style={{
                    color: token.colorTextDescription,
                  }}
                >
                  {item.content}
                </div>
                {/* )} */}
              </Space>
            ) : (
              <div
                className="w-full h-full"
                style={{
                  color: token.colorTextDescription,
                }}
              >
                <StayTuned size={isMobile ? 4 : 6}></StayTuned>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CreationNavgation
