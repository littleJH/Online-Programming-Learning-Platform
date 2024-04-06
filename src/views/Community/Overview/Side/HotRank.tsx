import { currentArticleState } from '@/store/appStore'
import { getArticleApi, getArticleHotRankApi } from '@/api/article'
import { IArticle } from '@/type'
import { Skeleton, Space, Card, List, theme, Menu, Segmented, Divider } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import myHooks from '@/tool/myHooks/myHooks'
import MySvgIcon from '@/components/Icon/MySvgIcon'

interface IArticleRank {
  Member: string
  Score: number
  article: IArticle
}

interface IRank {
  id: string
  title: string
  score: number
  type: Type
}

type Type = 'articleset' | 'userset' | 'commentset' | 'postset'

const HotRank: React.FC<{ type: Type }> = (props) => {
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
        title: article.article.title,
        score: article.Score,
        type: 'articleset',
        id: article.Member,
      }))
    )
  }

  const fetchUserRank = async () => {}

  const fetchCommentRank = async () => {}
  const fetchPostRank = async () => {}

  const handleClick = (index: number) => rankList && nav(`/community/${rankList[index].type}/${rankList[index].id}`)

  return (
    // <>
    //   {!articleRank && (
    //     <Skeleton
    //       active
    //       paragraph={{ rows: 9 }}
    //       className='px-4'
    //     ></Skeleton>
    //   )}
    //   {articleRank && (
    //     <List
    //       dataSource={articleRank}
    //       style={{
    //         backgroundColor: token.colorBgBase
    //       }}
    //       renderItem={(article: IArticleRank, index: number) => (
    //         <List.Item
    //           key={JSON.stringify(article)}
    //           style={{
    //             padding: 0
    //           }}
    //         >
    //           <div
    //             className='flex items-center w-full p-1'
    //             onClick={() => {
    //               handleClick(index)
    //             }}
    //           >
    //             <span className='w-8 text-center'>
    //               {/* {index <= 2 && (
    //         <svg className='icon'>
    //           <use href={index === 0 ? '#icon-top-one' : index === 1 ? '#icon-top-two' : index === 2 ? '#icon-top-three' : ''}></use>
    //         </svg>
    //       )} */}
    //               {/* {index > 2 && ( */}
    //               <span className='w-8 flex justify-center'>
    //                 <div className='w-4 h-4 text-xs bg-slate-100 rounded-full'>{index + 1}</div>
    //               </span>
    //               {/* )} */}
    //             </span>
    //             <span
    //               className='w-36 mx-2 text-xs'
    //               style={{
    //                 overflow: 'hidden',
    //                 textOverflow: 'ellipsis',
    //                 whiteSpace: 'nowrap'
    //               }}
    //             >
    //               {article.article.title}
    //             </span>
    //             <span className='w-12 flex items-center justify-center'>
    //               <span>
    //                 <svg className='icon-small'>
    //                   <use href='#icon-fire'></use>
    //                 </svg>
    //               </span>
    //               <span className='text-right text-xs'>{article.Score}</span>
    //             </span>
    //           </div>
    //         </List.Item>
    //       )}
    //     ></List>
    //   )}
    // </>

    <Space direction="vertical" className="w-full">
      {!rankList && <Skeleton active paragraph={{ rows: 9 }} className="px-4"></Skeleton>}
      {rankList &&
        rankList?.map((item, index) => (
          <div key={index}>
            <Card
              size="small"
              hoverable
              onClick={() => {
                handleClick(index)
              }}
              bordered={false}
              styles={{
                body: { padding: '0px' },
              }}
            >
              <div className="flex items-center w-full p-1">
                <span className="w-8 text-center">
                  {/* {index <= 2 && (
                  <svg className='icon'>
                    <use href={index === 0 ? '#icon-top-one' : index === 1 ? '#icon-top-two' : index === 2 ? '#icon-top-three' : ''}></use>
                  </svg>
                )} */}
                  {/* {index > 2 && ( */}
                  <span className="w-8 flex justify-center">
                    <div className="w-4 h-4 text-xs bg-slate-100 rounded-full">{index + 1}</div>
                  </span>
                  {/* )} */}
                </span>
                <span
                  className="w-36 mx-2 text-xs"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </span>
                <span className="w-12 flex items-center justify-center">
                  <span>
                    <svg className="icon-small">
                      <use href="#icon-fire"></use>
                    </svg>
                  </span>
                  <span className="text-right text-xs">{item.score}</span>
                </span>
              </div>
            </Card>
          </div>
        ))}
    </Space>
  )
}

export default HotRank
