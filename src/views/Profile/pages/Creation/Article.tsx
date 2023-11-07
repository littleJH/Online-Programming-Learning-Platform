import React, { useEffect, useState } from 'react'
import ArticleCard from '@/components/card/ArticleCard'
import { IArticle } from '@/type'
import { getArticleListApi } from '@/api/article'
import { useSetRecoilState } from 'recoil'
import { currentArticleState } from '@/store/appStore'
import { useNavigate } from 'react-router-dom'
import useNavTo from '@/tool/myHooks/useNavTo'
import { List, Button, Popconfirm } from 'antd'

const Article: React.FC = () => {
  const nav = useNavTo()
  const [articleList, setArticleList] = useState<IArticle[]>([])
  const setcurrentArticle = useSetRecoilState(currentArticleState)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticleListApi(pageNum, pageSize).then((res) => {
      setArticleList(res.data.data.articles)
      setLoading(false)
    })
  }, [])

  const handleArticleClick = (article: IArticle) => {
    setcurrentArticle(article)
    nav(`/community/article/${article.id}`)
  }

  const handleDelete = (id: string) => {}

  return (
    <div>
      <List
        dataSource={articleList}
        loading={loading}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                type='link'
                style={{ padding: '0' }}
                onClick={() => nav(`/community/article/${item.id}`)}
              >
                详情
              </Button>,
              <Button
                style={{ padding: '0' }}
                type='link'
                onClick={() => nav(`/creation/article?article_id=${item.id}`)}
              >
                更新
              </Button>,
              <Popconfirm
                title='确定删除该文章？'
                okText='确认'
                cancelText='取消'
                onConfirm={() => handleDelete(item.id)}
              >
                <Button
                  style={{ padding: '0' }}
                  type='link'
                  danger
                >
                  删除
                </Button>
              </Popconfirm>
            ]}
          >
            <div className='w-full'>
              <ArticleCard
                key={item.id}
                articleProp={item}
                onclick={handleArticleClick}
                mode='action'
              ></ArticleCard>
            </div>
          </List.Item>
        )}
      ></List>
    </div>
  )
}

export default Article
