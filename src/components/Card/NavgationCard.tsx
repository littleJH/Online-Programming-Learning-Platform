import React from 'react'
import style from './style.module.scss'
import { Card, Space, theme } from 'antd'
import MySvgIcon from '../Icon/MySvgIcon'
import myHooks from '@/tool/myHooks/myHooks'
import StayTuned from '../Empty/StayTuned'
import { useRecoilValue } from 'recoil'
import { isMobileAtom } from '@/store/appStore'

interface IProps {
  title: string | null
  path: string | undefined
  icon?: React.ReactNode
  content?: string
}

const NavgationCard: React.FC<IProps> = (props) => {
  const { title, content, path, icon } = props
  const isMobile = useRecoilValue(isMobileAtom)
  const nav = myHooks.useNavTo()
  const { token } = theme.useToken()

  return (
    <div className={style.cardBox}>
      <Card
        classNames={{
          body: style.cardBody,
        }}
        id={path}
        className={style.item}
        onClick={() => path && nav(`${path}`)}
        hoverable
      >
        {title ? (
          <Space direction="vertical" className={style.navCard}>
            <div className={style.icon}>
              {typeof icon === 'object' && icon}
              {typeof icon === 'string' && <MySvgIcon href={icon} size={2}></MySvgIcon>}
            </div>
            <div className={style.title}>{title}</div>
            {/* {!isMobile && ( */}
            <div
              className={style.desc}
              style={{
                color: token.colorTextDescription,
              }}
            >
              {content}
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
    </div>
  )
}

export default NavgationCard
