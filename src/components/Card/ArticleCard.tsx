import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { iconBaseUrl, imgGetBaseUrl } from '@/config/apiConfig'
import { IArticle } from '@/type'
import { Avatar, Space, theme, Card } from 'antd'
import style from './style.module.scss'
import utils from '@/tool/myUtils/utils'
import MyTag from '../Label/MyTag'
import { getUserInfoApi } from '@/api/user'
import {
  getArticleCollectNumApi,
  getArticleCollectedApi,
  getArticleLabelsApi,
  getArticleLikeNumApi,
  getArticleLikedApi,
  getArticleVisibleNumApi,
} from '@/api/article'
import { getArticleRemarkListApi } from '@/api/remark'
import MySvgIcon from '../Icon/MySvgIcon'
import GeneralCard from './GeneralCard'

interface IProps {
  articleProp: IArticle
  onclick?: Function
  mode?: 'default' | 'action'
}

const ArticleCard: React.FC<IProps> = (props) => {
  const { articleProp, onclick, mode = 'default' } = props
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
      getArticleRemarkListApi(articleProp.id),
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
        total: res[7].data.data.total,
      }
      setArticle(article)
    })
  }, [])

  const ago = useMemo(() => {
    const { num, unit } = utils.getTimeAgo(article.created_at)
    return `${num}${unit}前`
  }, [article])

  const imgUrl = useMemo(
    () => article.res_long && article.res_long !== '' && JSON.parse(article.res_long).img,
    [article]
  )

  const renderBody = () => (
    <GeneralCard
      user={article.user}
      content={article.content}
      title={article.title}
      img={imgUrl}
      ago={ago}
      labels={article.labels}
      remarkCount={article.remark?.total}
      liked={{
        count: article.likeNum,
        isLiked: article.liked,
      }}
      collected={{
        count: article.collectNum,
        isCollected: article.collected,
      }}
      viewCount={article.visibleNum}
    ></GeneralCard>
  )

  return (
    <>
      {mode === 'default' && (
        <Card onClick={() => onclick && onclick(article)} className="my-2" hoverable size="small">
          {renderBody()}
        </Card>
      )}
      {mode === 'action' && renderBody()}
    </>
  )
}

export default ArticleCard
