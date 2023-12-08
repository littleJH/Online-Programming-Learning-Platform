import { Space, theme, Badge } from 'antd'
import React, { CSSProperties, MouseEventHandler } from 'react'
import style from './style.module.scss'
import MySvgIcon from '../Icon/MySvgIcon'

interface Iprops {
  onLikeClick: MouseEventHandler<HTMLDivElement>
  onCollectClick: MouseEventHandler<HTMLDivElement>
  onCommentClick: MouseEventHandler<HTMLDivElement>
  onArrowupClick: MouseEventHandler<HTMLDivElement>
  likeNum: number
  collectNum: number
  remarkNum: number
  liked: number
  collected: boolean
}

const SideActionBar: React.FC<Iprops> = props => {
  const {
    onLikeClick,
    onCollectClick,
    onCommentClick,
    onArrowupClick,
    likeNum,
    collectNum,
    remarkNum,
    liked,
    collected,
  } = props
  const { token } = theme.useToken()
  const colorStyle: CSSProperties = {
    backgroundColor: token.colorBgBase,
    color: token.colorTextDescription,
  }
  return (
    <div>
      <Space direction="vertical" size={'large'}>
        <Badge
          size="small"
          count={likeNum}
          offset={[-5, 5]}
          color={token.colorPrimary}
        >
          <div className={style.item} onClick={onLikeClick} style={colorStyle}>
            <MySvgIcon
              href={liked === 1 ? '#icon-liked' : '#icon-like'}
              size={1.5}
              color={
                liked === 1
                  ? token.colorPrimaryTextHover
                  : token.colorTextDescription
              }
            ></MySvgIcon>
          </div>
        </Badge>
        <Badge
          size="small"
          count={collectNum}
          offset={[-5, 5]}
          color={token.colorPrimary}
        >
          <div
            className={style.item}
            onClick={onCollectClick}
            style={colorStyle}
          >
            <MySvgIcon
              href={collected ? '#icon-collected' : '#icon-collect'}
              size={1.5}
              color={
                collected
                  ? token.colorPrimaryTextHover
                  : token.colorTextDescription
              }
            ></MySvgIcon>
          </div>
        </Badge>
        <Badge
          size="small"
          count={remarkNum}
          offset={[-5, 5]}
          color={token.colorPrimary}
        >
          <div
            className={style.item}
            onClick={onCommentClick}
            style={colorStyle}
          >
            <MySvgIcon href="#icon-comment" size={1.5}></MySvgIcon>
          </div>
        </Badge>
        <div className={style.item} onClick={onArrowupClick} style={colorStyle}>
          <MySvgIcon href="#icon-arrowup" size={1.5}></MySvgIcon>
        </div>
      </Space>
    </div>
  )
}

export default SideActionBar
