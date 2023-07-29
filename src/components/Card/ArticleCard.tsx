import React, { useMemo } from 'react'
import { iconBaseUrl } from '@/api/baseConfig'
import { IArticle } from '@/vite-env'
import { Avatar, Space } from 'antd'
import style from './style.module.scss'
import GetTimeago from '@/tool/myFns/GetTimeago'
import CommunityLabel from '../Label/CommunityLabel/CommunityLabel'

interface IProps {
  article: IArticle
  onclick: Function
}

const ArticleCard: React.FC<IProps> = props => {
  const { article, onclick } = props

  const ago = useMemo(() => {
    const { num, unit } = GetTimeago(article.created_at)
    return `${num}${unit}前`
  }, [article])

  return (
    <div
      className="w-full p-4  rounded shadow my-4 hover:cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onclick(article.id)}
    >
      <div className="flex">
        {/* left */}
        <div className="grow" style={{ width: '100px' }}>
          <div className="flex items-center my-2">
            <Avatar
              className="card-avatar"
              src={<img src={`${iconBaseUrl}/${article.user?.icon}`}></img>}
            ></Avatar>
            <div className="card-username">{article.user?.name}</div>
            <div className="card-time">{ago}</div>
            {article.labels && article.labels.length > 0 && (
              <Space className="mx-8">
                {article.labels.map(label => (
                  <CommunityLabel key={label.id} label={label}></CommunityLabel>
                ))}
              </Space>
            )}
          </div>
          <div className="card-title">{article.title}</div>
          <div
            className="card-content"
            style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {article.content.replace(/<[^<>]+>/g, '')}
          </div>

          {/* footer */}
          <div className="flex items-center mt-2">
            <div className={`${style.footer} grow flex items-center`}>
              <div>
                <svg className="icon-small">
                  <use
                    href={
                      article.collected ? '#icon-collected' : '#icon-collect'
                    }
                  ></use>
                </svg>
                <span>{article.collectNum}</span>
              </div>
              <div className="divider-vertical"></div>
              <div>
                <svg className="icon-small">
                  <use
                    href={article.liked ? '#icon-liked' : '#icon-like'}
                  ></use>
                </svg>
                <span>{article.likeNum}</span>
              </div>
              <div className="divider-vertical"></div>
              <div>
                <svg className="icon-small">
                  <use href="#icon-comment"></use>
                </svg>
                <span>{article.remark?.total}</span>
              </div>
              <div className="divider-vertical"></div>
              <div>
                <svg className="icon-small">
                  <use href="#icon-visible"></use>
                </svg>
                <span>{article.visibleNum}</span>
              </div>
            </div>
          </div>
        </div>

        {/* right image */}
        <div className="card-img" style={{}}>
          <img src={`${iconBaseUrl}/${article.user?.icon}`} alt="" />
        </div>
      </div>
    </div>
  )
}

export default ArticleCard
