import { currentArticleState } from '@/Recoil/store'
import { getArticleApi, getArticleHotRankApi } from '@/api/article'
import { IArticle } from '@/vite-env'
import { Skeleton, Space } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

interface IArticleRank {
  Member: string
  Score: number
  article: IArticle
}

const HotRank: React.FC = () => {
  const [articleRank, setarticleRank] = useState<IArticleRank[]>()
  // const setcurrentArticle = useSetRecoilState(currentArticleState)
  const nav = useNavigate()

  useEffect(() => {
    getArticleHotRankApi(1, 10).then(async res => {
      console.log(res.data)
      const articles: IArticleRank[] = res.data.data.articles
      let index = 0
      for (let article of articles) {
        const { data } = await getArticleApi(article.Member)
        articles[index].article = data.data.article
        index++
      }
      setarticleRank(articles)
    })
  }, [])

  const handleClick = useCallback(
    (index: number) => {
      if (articleRank) {
        // setcurrentArticle(articleRank[index].article)
        nav(`/community/article/${articleRank[index].Member}`)
      } else return
    },
    [articleRank]
  )
  return (
    <Space direction="vertical" className="w-full shadow rounded p-4 ">
      {!articleRank && (
        <Skeleton active paragraph={{ rows: 9 }} className="px-4"></Skeleton>
      )}
      {articleRank &&
        articleRank?.map((article, index) => (
          <div
            key={article.Member}
            className="flex items-center w-full py-1 hover:bg-slate-100 hover:shadow hover:rounded hover:cursor-pointer hover:text-indigo-500 transition-all"
            onClick={() => {
              handleClick(index)
            }}
          >
            <span className="w-8 text-center">
              {index <= 2 && (
                <svg className="icon">
                  <use
                    href={
                      index === 0
                        ? '#icon-top-one'
                        : index === 1
                        ? '#icon-top-two'
                        : index === 2
                        ? '#icon-top-three'
                        : ''
                    }
                  ></use>
                </svg>
              )}
              {index > 2 && (
                <span className="w-8 flex justify-center">
                  <div className="w-4 h-4 text-xs bg-slate-100 rounded-full">
                    {index + 1}
                  </div>
                </span>
              )}
            </span>
            <span
              className="w-36 mx-2 text-xs"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {article.article.title}
            </span>
            <span className="w-12">
              <span>
                <svg className="icon-small">
                  <use href="#icon-fire"></use>
                </svg>
              </span>
              <span className="text-right text-xs">{article.Score}</span>
            </span>
          </div>
        ))}
    </Space>
  )
}

export default HotRank
