import { Space, theme } from 'antd'
import React, { CSSProperties, MouseEventHandler } from 'react'
import style from './style.module.scss'

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

const SideActionBar: React.FC<Iprops> = (props) => {
  const { onLikeClick, onCollectClick, onCommentClick, onArrowupClick, likeNum, collectNum, remarkNum, liked, collected } = props
  const { token } = theme.useToken()
  const colorStyle: CSSProperties = {
    backgroundColor: token.colorPrimaryBg,
    color: token.colorPrimaryText
  }
  return (
    <div>
      <Space
        direction='vertical'
        size={'large'}
      >
        <div
          className={style.item}
          onClick={onLikeClick}
          style={colorStyle}
        >
          <div className={style.num}>{likeNum}</div>
          <svg className='icon'>
            <use href={liked === 1 ? '#icon-liked' : '#icon-like'}></use>
          </svg>
        </div>
        <div
          className={style.item}
          onClick={onCollectClick}
          style={colorStyle}
        >
          <div className={style.num}>{collectNum}</div>
          <svg className='icon'>
            <use href={collected ? '#icon-collected' : '#icon-collect'}></use>
          </svg>
        </div>
        <div
          className={style.item}
          onClick={onCommentClick}
          style={colorStyle}
        >
          <div className={style.num}>{remarkNum}</div>
          <svg className='icon'>
            <use href='#icon-comment'></use>
          </svg>
        </div>
        <div
          className={style.item}
          onClick={onArrowupClick}
          style={colorStyle}
        >
          <svg className='icon'>
            <use href='#icon-arrowup'></use>
          </svg>
        </div>
      </Space>
    </div>
  )
}

export default SideActionBar
