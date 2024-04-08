import React, { useEffect, useState } from 'react'
import GeneralDetail from '../../components/GeneralDetail/GeneralDetail'
import { useParams } from 'react-router-dom'
import { IPost } from '@/type'
import { useRecoilState } from 'recoil'
import { currentPostState } from '@/store/appStore'
import {
  cancelLikePostApi,
  collectPostApi,
  deleteCollectPostApi,
  getPostApi,
  getPostCollectNumApi,
  getPostCollectedApi,
  getPostLabelsApi,
  getPostLikeNumApi,
  getPostLikedApi,
  getPostVisibleNumApi,
  likePostApi,
  setPostVisibleApi,
} from '@/api/post'
import { createPostThreadApi, getPostThreadListApi } from '@/api/thread'
import { getUserInfoApi } from '@/api/user'

const Element: React.FC = () => {
  const { post_id = '' } = useParams()
  const [currentPost, setCurrentPost] = useRecoilState(currentPostState)
  const [remarkContent, setremarkContent] = useState('')
  const [openRemarkModal, setOpenRemarkModal] = useState(false)

  useEffect(() => {
    return () => {
      setCurrentPost(null)
    }
  }, [])

  useEffect(() => {
    console.log('current post ==> ', currentPost)
    typeof currentPost?.likeNum !== 'number' && fetch()
    setPostVisibleApi(post_id)
  }, [currentPost])

  const fetch = async () => {
    const res = await Promise.all([
      getPostApi(post_id),
      getPostLikedApi(post_id),
      getPostLikeNumApi(post_id, 'true'),
      getPostCollectedApi(post_id),
      getPostCollectNumApi(post_id),
      getPostVisibleNumApi(post_id),
      getPostLabelsApi(post_id),
      getPostThreadListApi(post_id),
    ])
    const post: IPost = res[0].data.data.post
    post.liked = res[1].data.data.like
    post.likeNum = res[2].data.data.total
    post.collected = res[3].data.data.collect
    post.collectNum = res[4].data.data.total
    post.visibleNum = res[5].data.data.total
    post.labels = res[6].data.data.postLabels
    post.remark = {
      remarks: res[7].data.data.threads,
      total: res[7].data.data.total,
    }
    const userRes = await getUserInfoApi(post.user_id)
    post.user = userRes.data.data.user
    setCurrentPost(post)
  }

  const handleArrowupClick = () => {
    const a = document.createElement('a')
    a.href = '#top'
    a.click()
  }
  const handleCommentClick = () => {
    const a = document.createElement('a')
    a.href = '#remark'
    a.click()
  }
  const handleLikeClick = () => {
    const like = () => {
      likePostApi(post_id, 'true').then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentPost) {
          const { data } = await getPostLikeNumApi(post_id, 'true')
          console.log(data)
          setCurrentPost((value) => {
            return {
              ...value,
              liked: 1,
              likeNum: data.data.total,
            } as IPost
          })
        }
      })
    }
    const cancelLike = () => {
      cancelLikePostApi(post_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentPost) {
          const { data } = await getPostLikeNumApi(post_id, 'true')
          setCurrentPost((value) => {
            return {
              ...value,
              liked: 0,
              likeNum: data.data.total,
            } as IPost
          })
        }
      })
    }
    currentPost?.liked === 1 ? cancelLike() : like()
  }
  const handleCollectClick = () => {
    const collect = () => {
      collectPostApi(post_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentPost) {
          const { data } = await getPostCollectNumApi(post_id)
          setCurrentPost((value) => {
            return {
              ...value,
              collected: true,
              collectNum: data.data.total,
            } as IPost
          })
        }
      })
    }
    const cancelCollect = () => {
      deleteCollectPostApi(post_id).then(async (res) => {
        console.log(res.data)
        if (res.data.code === 200 && currentPost) {
          const { data } = await getPostCollectNumApi(post_id)
          setCurrentPost((value) => {
            return {
              ...value,
              collected: false,
              collectNum: data.data.total,
            } as IPost
          })
        }
      })
    }
    currentPost?.collected ? cancelCollect() : collect()
  }
  const handleSubmitRemarkClick = () => {
    console.log(remarkContent)
    createPostThreadApi(
      post_id,
      JSON.stringify({
        content: remarkContent,
      })
    ).then(async (res) => {
      if (res.data.code === 200) {
        setOpenRemarkModal(false)
        setremarkContent('')
        const { data } = await getPostThreadListApi(post_id)
        setCurrentPost((value) => {
          return {
            ...value,
            remark: {
              remarks: data.data.threads,
              total: data.data.total,
            },
          } as IPost
        })
      }
    })
  }

  return (
    <GeneralDetail
      currentObject={currentPost}
      remarkContent={remarkContent}
      onRemarkChange={(value) => setremarkContent(value)}
      openRemarkModal={openRemarkModal}
      onRemarkModalChange={(value) => setOpenRemarkModal(value)}
      onArrowupClick={handleArrowupClick}
      onCollectClick={handleCollectClick}
      onCommentClick={handleCommentClick}
      onLikeClick={handleLikeClick}
      onSubmitRemarkClick={handleSubmitRemarkClick}
    ></GeneralDetail>
  )
}

export default Element
