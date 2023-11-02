import { IArticle } from '@/type'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { currentArticleState } from '@/store/appStore'
import { useRecoilState } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  collectArticleApi,
  deleteCollectArticleApi,
  deleteLikeArticleApi,
  getArticleApi,
  getArticleCollectNumApi,
  getArticleCollectedApi,
  getArticleHotRankApi,
  getArticleLabelsApi,
  getArticleLikeNumApi,
  getArticleLikedApi,
  getArticleVisibleNumApi,
  likeArticleApi,
  setArticleVisibleApi
} from '@/api/article'
import { createArticleRemarkApi, getArticleRemarkListApi } from '@/api/remark'
import { getUserInfoApi } from '@/api/user'
import ReadOnly from '@/components/editor/ReadOnly'
import { Button, Divider, Modal, Space } from 'antd'
import CommunityLabel from '@/components/Label/CommunityLabel/CommunityLabel'
import TextEditor from '@/components/editor/TextEditor'
import RemarkCard from '@/components/Card/RemarkCard'
import SideActionBar from '@/components/SideActionBar/SideActionBar'

const Detail: React.FC = () => {
  const { article_id } = useParams() as { article_id: string }
  const [currentArticle, setcurrentArticle] = useRecoilState(currentArticleState)
  const [openRemarkModal, setopenRemarkModal] = useState(false)
  const [remarkContent, setremarkContent] = useState('')

  useEffect(() => {
    return () => {
      setcurrentArticle(null)
    }
  }, [])

  useEffect(() => {
    typeof currentArticle?.likeNum !== 'number' && fetch()
    setArticleVisibleApi(article_id)
  }, [currentArticle])

  const fetch = async () => {
    const res = await Promise.all([
      getArticleApi(article_id),
      getArticleLikedApi(article_id),
      getArticleLikeNumApi(article_id, 'true'),
      getArticleCollectedApi(article_id),
      getArticleCollectNumApi(article_id),
      getArticleVisibleNumApi(article_id),
      getArticleLabelsApi(article_id),
      getArticleRemarkListApi(article_id)
    ])
    const article: IArticle = res[0].data.data.article
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
    const userRes = await getUserInfoApi(article.user_id)
    article.user = userRes.data.data.user
    setcurrentArticle(article)
  }

  const handleLikeClick = () => {
    const like = () => {
      likeArticleApi(article_id, 'true').then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleLikeNumApi(article_id, 'true')
          console.log(data)
          setcurrentArticle((value) => {
            return {
              ...value,
              liked: 1,
              likeNum: data.data.total
            } as IArticle
          })
        }
      })
    }
    const cancelLike = () => {
      deleteLikeArticleApi(article_id).then((res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          setcurrentArticle((value) => {
            return {
              ...value,
              liked: 0
            } as IArticle
          })
        }
      })
    }
    currentArticle?.liked === 1 ? cancelLike() : like()
  }

  const handleCollectClick = () => {
    const collect = () => {
      collectArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleCollectNumApi(article_id)
          setcurrentArticle((value) => {
            return {
              ...value,
              collected: true,
              collectNum: data.data.total
            } as IArticle
          })
        }
      })
    }
    const cancelCollect = () => {
      deleteCollectArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleCollectNumApi(article_id)
          setcurrentArticle((value) => {
            return {
              ...value,
              collected: false,
              collectNum: data.data.total
            } as IArticle
          })
        }
      })
    }
    currentArticle?.collected ? cancelCollect() : collect()
  }
  const handleSubmitRemarkClick = () => {
    console.log(remarkContent)
    createArticleRemarkApi(
      article_id,
      JSON.stringify({
        content: remarkContent
      })
    ).then(async (res) => {
      if (res.data.code === 200) {
        setopenRemarkModal(false)
        setremarkContent('')
        const { data } = await getArticleRemarkListApi(article_id)
        setcurrentArticle((value) => {
          return {
            ...value,
            remark: {
              remarks: data.data.remarks,
              total: data.data.total
            }
          } as IArticle
        })
      }
    })
  }

  const handleCommentClick = () => {
    const a = document.createElement('a')
    a.href = '#remark'
    a.click()
  }

  const handleArrowupClick = () => {
    const a = document.createElement('a')
    a.href = '#top'
    a.click()
  }
  return (
    <>
      {currentArticle && (
        <>
          <div id='top'></div>
          <div className='flex'>
            <div
              style={{
                backgroundColor: '#fff'
              }}
            >
              <div
                style={{ width: '820px' }}
                className={`h-full shadow rounded px-8 py-8  transition-all duration-500 ease-in-out`}
              >
                {/* header */}
                <div>
                  <h1 className='mt-0'>{currentArticle.title}</h1>
                  <Space
                    size={'large'}
                    className='text-sm text-slate-500'
                  >
                    <span>作者：{currentArticle.user?.name}</span>
                    <span>发布于：{currentArticle.created_at}</span>
                    <span>阅读：{currentArticle.visibleNum}</span>
                    <span></span>
                  </Space>

                  <Space>
                    {currentArticle.labels &&
                      currentArticle.labels.map((label, index) => (
                        <CommunityLabel
                          label={label}
                          key={index}
                        ></CommunityLabel>
                      ))}
                  </Space>
                </div>
                <Divider></Divider>
                {/* body */}
                <ReadOnly html={currentArticle.content}></ReadOnly>
              </div>
              {/* remark */}
              <div id='remark'>
                <div className='flex justify-center'>
                  <Button
                    type='dashed'
                    className='shadow m-4'
                    onClick={() => setopenRemarkModal(true)}
                  >
                    #我有一言
                  </Button>
                </div>
                <div>
                  {currentArticle.remark &&
                    currentArticle.remark.remarks.map((remark) => (
                      <RemarkCard
                        remark={remark}
                        key={remark.id}
                      ></RemarkCard>
                    ))}
                </div>
              </div>
            </div>
            {/* <div className='w-8'></div> */}
            {/* <div className='w-64 h-96 shadow rounded '></div> */}
          </div>

          <div
            className={`w-12 h-12 px-4 fixed top-1/2 right-0 flex flex-col`}
            style={{
              translate: '-50% -50%'
            }}
          >
            <SideActionBar
              onArrowupClick={handleArrowupClick}
              onCollectClick={handleCollectClick}
              onCommentClick={handleCommentClick}
              onLikeClick={handleLikeClick}
              likeNum={currentArticle.likeNum}
              collectNum={currentArticle.collectNum}
              remarkNum={currentArticle.remark.total}
              liked={currentArticle.liked}
              collected={currentArticle.collected}
            ></SideActionBar>
          </div>
          <Modal
            open={openRemarkModal}
            onCancel={() => setopenRemarkModal(false)}
            footer={[
              <Button
                type='primary'
                onClick={handleSubmitRemarkClick}
              >
                发布
              </Button>
            ]}
            title={'我有一言'}
            style={{
              top: '50%',
              translate: '0 -50%'
            }}
          >
            <div>
              <TextEditor
                mode='markdown'
                value={remarkContent}
                htmlChange={(value: string) => setremarkContent(value)}
                placeholder=' '
                className='h-36'
              ></TextEditor>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

export default Detail
