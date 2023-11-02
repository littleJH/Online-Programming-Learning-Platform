import React, { useEffect, useMemo, useState } from 'react'
import { iconBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'
import { IArticle } from '@/type'
import { Avatar, Space, theme, Card } from 'antd'
import style from './style.module.scss'
import GetTimeago from '@/tool/myFns/GetTimeago'
import CommunityLabel from '../Label/CommunityLabel/CommunityLabel'
import { getUserInfoApi } from '@/api/user'
import { getArticleCollectNumApi, getArticleCollectedApi, getArticleLabelsApi, getArticleLikeNumApi, getArticleLikedApi, getArticleVisibleNumApi } from '@/api/article'
import { getArticleRemarkListApi } from '@/api/remark'
import MySvgIcon from '../Icon/MySvgIcon'
import { useRecoilValue } from 'recoil'
import { themeState } from '@/store/appStore'

interface IProps {
  articleProp: IArticle
  onclick: Function
}

const ArticleCard: React.FC<IProps> = (props) => {
  const { articleProp, onclick } = props
  const [article, setArticle] = useState<IArticle>(articleProp)
  const { token } = theme.useToken()

  useEffect(() => {
    const article = { ...articleProp }
    Promise.all([
      getUserInfoApi(articleProp.user_id),
      getArticleLikedApi(articleProp.id),
      getArticleLikeNumApi(articleProp.id, 'true'),
      getArticleCollectedApi(articleProp.id),
      getArticleCollectNumApi(articleProp.id),
      getArticleVisibleNumApi(articleProp.id),
      getArticleLabelsApi(articleProp.id),
      getArticleRemarkListApi(articleProp.id)
    ]).then((res) => {
      article.user = res[0].data.data.user
      article.liked = res[1].data.data.like
      article.likeNum = res[2].data.data.total
      article.collected = res[3].data.data.collect
      article.collectNum = res[4].data.data.total
      article.visibleNum = res[5].data.data.total
      article.labels = res[6].data.data.articleLabels
      article.remark = {
        remarks: res[7].data.data.remarks,
        total: res[7].data.data.total
      }
      setArticle(article)
    })
  }, [])

  const ago = useMemo(() => {
    const { num, unit } = GetTimeago(article.created_at)
    return `${num}${unit}前`
  }, [article])

  const imgUrl = useMemo(() => article.res_long && article.res_long !== '' && JSON.parse(article.res_long).img, [article])

  return (
    <Card
      onClick={() => onclick(article)}
      className='my-4'
      size='small'
      hoverable
    >
      <div className='flex'>
        {/* left */}
        <div
          className='grow'
          style={{ width: '100px' }}
        >
          <div className='flex items-center my-2'>
            <Avatar
              className='card-avatar'
              src={`${iconBaseUrl}/${article.user?.icon}`}
            ></Avatar>
            <div className='card-username'>{article.user?.name}</div>
            <div className='card-time'>{ago}</div>
            {article.labels && article.labels.length > 0 && (
              <Space className='mx-8'>
                {article.labels.map((label) => (
                  <CommunityLabel
                    key={label.id}
                    label={label}
                  ></CommunityLabel>
                ))}
              </Space>
            )}
          </div>
          <div className='card-title'>{article.title}</div>
          <div
            className='card-content'
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
          <div className='flex items-center mt-2'>
            <div className={`${style.footer} grow flex items-center`}>
              <div>
                <MySvgIcon
                  href={article.collected ? '#icon-collected' : '#icon-collect'}
                  color={article.collected ? token.colorPrimary : ''}
                ></MySvgIcon>
                <span>{article.collectNum}</span>
              </div>
              <div className='divider-vertical'></div>
              <div>
                <MySvgIcon
                  href={article.liked ? '#icon-liked' : '#icon-like'}
                  color={article.liked ? token.colorPrimary : ''}
                ></MySvgIcon>
                <span>{article.likeNum}</span>
              </div>
              <div className='divider-vertical'></div>
              <div>
                <MySvgIcon href={'#icon-comment'}></MySvgIcon>
                <span>{article.remark?.total}</span>
              </div>
              <div className='divider-vertical'></div>
              <div>
                <MySvgIcon href={'#icon-visible'}></MySvgIcon>
                <span>{article.visibleNum}</span>
              </div>
            </div>
          </div>
        </div>

        {/* right image */}
        {imgUrl && (
          <div
            className='card-img'
            style={{}}
          >
            <img
              src={`${imgGetBaseUrl}/${imgUrl}`}
              alt=''
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export default ArticleCard
