import React, { useEffect, useState } from 'react'
import GeneralDetail from '../GeneralDetail/GeneralDetail'
import { useParams } from 'react-router-dom'
import { IPost } from '@/type'
import { useRecoilState } from 'recoil'
import { currentPostState } from '@/store/appStore'
import { getPostApi } from '@/api/post'

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
    // setArticleVisibleApi(post_id)
  }, [currentPost])

  const fetch = async () => {
    setCurrentPost((await getPostApi(post_id)).data.data.post)
  }

  const handleArrowupClick = () => {}
  const handleCommentClick = () => {}
  const handleLikeClick = () => {}
  const handleCollectClick = () => {}
  const handleSubmitRemarkClick = () => {}

  return (
    <GeneralDetail
      currentObject={currentPost}
      openRemarkModal={openRemarkModal}
      setOpenRemarkModal={setOpenRemarkModal}
      onArrowupClick={handleArrowupClick}
      onCollectClick={handleCollectClick}
      onCommentClick={handleCommentClick}
      onLikeClick={handleLikeClick}
      onSubmitRemarkClick={handleSubmitRemarkClick}
    ></GeneralDetail>
  )
}

export default Element
