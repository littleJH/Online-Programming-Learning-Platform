import { IArticle } from '@/type'
import React, { useEffect, useMemo, useState } from 'react'
import { currentArticleState, isMobileAtom, sideBarTypeState } from '@/store/appStore'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useParams } from 'react-router-dom'
import {
  collectArticleApi,
  deleteCollectArticleApi,
  deleteLikeArticleApi,
  getArticleApi,
  getArticleCollectNumApi,
  getArticleCollectedApi,
  getArticleLabelsApi,
  getArticleLikeNumApi,
  getArticleLikedApi,
  getArticleVisibleNumApi,
  likeArticleApi,
  setArticleVisibleApi,
} from '@/api/article'
import { createArticleRemarkApi, getArticleRemarkListApi } from '@/api/remark'
import { getUserInfoApi } from '@/api/user'
import GeneralDetail from '../../components/GeneralDetail/GeneralDetail'

const Detail: React.FC = () => {
  const { article_id = '' } = useParams()
  const [currentArticle, setcurrentArticle] = useRecoilState(currentArticleState)
  const [remarkContent, setremarkContent] = useState('')
  const [openRemarkModal, setopenRemarkModal] = useState(false)

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
      getArticleRemarkListApi(article_id),
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
      total: res[7].data.data.total,
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
              likeNum: data.data.total,
            } as IArticle
          })
        }
      })
    }
    const cancelLike = () => {
      deleteLikeArticleApi(article_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentArticle) {
          const { data } = await getArticleLikeNumApi(article_id, 'true')
          setcurrentArticle((value) => {
            return {
              ...value,
              liked: 0,
              likeNum: data.data.total,
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
              collectNum: data.data.total,
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
              collectNum: data.data.total,
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
        content: remarkContent,
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
              total: data.data.total,
            },
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
    <GeneralDetail
      currentObject={currentArticle}
      remarkContent={remarkContent}
      openRemarkModal={openRemarkModal}
      onArrowupClick={handleArrowupClick}
      onCollectClick={handleCollectClick}
      onCommentClick={handleCommentClick}
      onLikeClick={handleLikeClick}
      onSubmitRemarkClick={handleSubmitRemarkClick}
      onRemarkChange={(value) => setremarkContent(value)}
      onRemarkModalChange={(value) => setopenRemarkModal(value)}
    ></GeneralDetail>
  )
}

export default Detail
