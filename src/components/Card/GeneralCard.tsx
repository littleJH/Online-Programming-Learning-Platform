import { iconBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'
import { Avatar, Divider, Space, theme } from 'antd'
import React from 'react'
import MyTag from '../Label/MyTag'
import MySvgIcon from '../Icon/MySvgIcon'
import { User } from '@/type'
import style from './style.module.scss'
import MyAvatar from '../Avatar/MyAvatar'

interface IProps {
  user?: User
  title?: React.ReactNode | (() => React.ReactNode)
  content?: React.ReactNode | (() => React.ReactNode)
  img?: React.ReactNode | (() => React.ReactNode)
  liked?: {
    count: number
    isLiked: -1 | 0 | 1
  }
  collected?: {
    count: number
    isCollected: boolean
  }
  remarkCount?: number
  viewCount?: number
  labels?: {
    id: string
    label: string
  }[]
  ago?: string
  onClick?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  extra?: React.ReactNode
}

const GeneralCard: React.FC<IProps> = (props) => {
  const {
    user,
    title,
    content,
    img,
    liked,
    collected,
    remarkCount,
    viewCount,
    labels,
    ago,
    onClick,
    header,
    footer,
    extra,
  } = props

  const { token } = theme.useToken()

  return (
    <div className={style.generalCard} onClick={onClick}>
      <div className="grow" style={{ width: '100px' }}>
        <div className="flex items-center">
          {user && (
            <>
              <MyAvatar user={user}></MyAvatar>
              <span className="card-username">{user?.name}</span>
            </>
          )}
          {ago && <div className="card-time">{ago}</div>}
          {labels && labels.length > 0 && (
            <Space
              style={{
                margin: !user && !ago ? '0' : '0 1rem',
              }}
              align="start"
              rootClassName={style.tags}
            >
              {labels.map((label) => (
                <MyTag key={label.id}>{label.label}</MyTag>
              ))}
            </Space>
          )}
          {header && <div className="grow flex justify-end">{header}</div>}
        </div>
        <div className="card-title">
          {typeof title === 'string' && title}
          {typeof title === 'function' && title()}
        </div>
        {typeof content === 'string' && (
          <div
            className="card-content"
            style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {content.replace(/<[^<>]+>/g, '')}
          </div>
        )}
        {typeof content === 'function' && content()}
        {typeof content === 'object' && content}

        {/* footer */}
        <div className="flex items-center mt-2">
          <Space split={<Divider type="vertical"></Divider>} className={`${style.footer} grow flex items-center`}>
            {collected && (
              <div>
                <MySvgIcon
                  href={collected?.isCollected ? '#icon-collected' : '#icon-collect'}
                  color={collected?.isCollected ? token.colorPrimaryTextHover : token.colorTextDescription}
                ></MySvgIcon>
                <span>{collected?.count}</span>
              </div>
            )}
            {liked && (
              <div>
                <MySvgIcon
                  href={liked?.isLiked ? '#icon-liked' : '#icon-like'}
                  color={liked?.isLiked ? token.colorPrimaryTextHover : token.colorTextDescription}
                ></MySvgIcon>
                <span>{liked?.count}</span>
              </div>
            )}
            {typeof remarkCount === 'number' && (
              <div>
                <MySvgIcon href={'#icon-comment'} color={token.colorTextDescription}></MySvgIcon>
                <span>{remarkCount}</span>
              </div>
            )}
            {typeof viewCount === 'number' && (
              <div>
                <MySvgIcon href={'#icon-visible'} color={token.colorTextDescription}></MySvgIcon>
                <span>{viewCount}</span>
              </div>
            )}
            {footer && <div className="grow flex justify-end">{footer}</div>}
          </Space>
        </div>
        {extra && <div className="p-4">{extra}</div>}
      </div>
      {img && (
        <div className={style.imgctn}>
          <img src={`${imgGetBaseUrl}/${img}`} className={`${style.img}`} alt=""></img>
        </div>
      )}
    </div>
  )
}

export default GeneralCard
