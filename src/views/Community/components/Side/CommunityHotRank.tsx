import { currentArticleState } from '@/store/appStore'
import { getArticleApi, getArticleHotRankApi } from '@/api/article'
import { IArticle } from '@/type'
import { Skeleton, Space, Card, List, theme, Menu, Segmented, Divider } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import myHooks from '@/tool/myHooks/myHooks'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import style from '@/views/Community/style.module.scss'
import HotRank from '@/components/Rank/GeneralRank'

interface IArticleRank {
  Member: string
  Score: number
  article: IArticle
}

interface IRank {
  id: string
  title: React.ReactNode
  score: number
  type: Type
}

type Type = 'articleset' | 'userset' | 'commentset' | 'postset'

const CommunityHotRank: React.FC<{ type: Type }> = (props) => {
  const { type } = props
  const [rankList, setRankList] = useState<IRank[]>([])
  // const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = myHooks.useNavTo()
  const { token } = theme.useToken()

  useEffect(() => {
    switch (type) {
      case 'articleset':
        fetchArticles()
        break
      case 'userset':
        fetchUserRank()
        break
      case 'commentset':
        fetchCommentRank()
        break
      case 'postset':
        fetchPostRank()
        break
      default:
        break
    }
  }, [type])

  const fetchArticles = async () => {
    const res = await getArticleHotRankApi(1, 10)
    const articles: IArticleRank[] = res.data.data.articles
    let index = 0
    for (let article of articles) {
      const { data } = await getArticleApi(article.Member)
      articles[index].article = data.data.article
      index++
    }
    setRankList(
      articles.map((article) => ({
        title: <div style={{ padding: '0.75rem 0' }}>{article.article.title}</div>,
        score: article.Score,
        type: 'articleset',
        id: article.Member,
      }))
    )
  }

  const fetchUserRank = async () => {}

  const fetchCommentRank = async () => {}
  const fetchPostRank = async () => {}

  const handleClick = (index: number) =>
    rankList && nav(`/community/${rankList[index].type.replace('set', '')}/${rankList[index].id}`)

  return <HotRank rankList={rankList} onClick={(index: number) => handleClick(index)} icon={'fire'}></HotRank>
}

export default CommunityHotRank
