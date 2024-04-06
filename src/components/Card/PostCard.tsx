import React, { useEffect, useMemo, useState } from 'react'
import GeneralCard from './GeneralCard'
import { IPost } from '@/type'
import utils from '@/tool/myUtils/utils'
import { getPostLikeNumApi, getPostLikedApi } from '@/api/post'
import { getUserInfoApi } from '@/api/user'
import ReadOnly from '../editor/Readonly'
import { Button, Card } from 'antd'
import myHooks from '@/tool/myHooks/myHooks'
import { useSetRecoilState } from 'recoil'
import { currentPostState } from '@/store/appStore'

interface IProps {
  postProps: IPost
  onClick?: Function
  mode?: 'default' | 'action'
  showReply?: boolean
  style?: React.CSSProperties
}

const Element: React.FC<IProps> = (props) => {
  const { postProps, onClick, mode = 'default', showReply, style } = props
  const nav = myHooks.useNavTo()
  const setCurrentPost = useSetRecoilState(currentPostState)
  const [post, setPost] = useState<IPost>(postProps)

  const ago = useMemo(() => {
    const { num, unit } = utils.getTimeAgo(post.created_at)
    return `${num}${unit}前`
  }, [post])

  useEffect(() => {
    fetchDetail()
  }, [])

  const fetchDetail = async () => {
    try {
      const clone = { ...postProps }
      const res = await Promise.all([
        getPostLikedApi(postProps.id),
        getPostLikeNumApi(postProps.id),
        getUserInfoApi(postProps.user_id),
      ])
      clone.liked = res[0].data.data.like
      clone.likeNum = res[1].data.data.total
      clone.user = res[2].data.data.user
      // clone.reply = showReply ? (await getPostReplyListApi(postProps.id)).data.data : null
      setPost(clone)
    } catch {}
  }
  return (
    <Card style={style} hoverable size="small">
      <GeneralCard
        user={post?.user}
        liked={{
          count: post.likeNum,
          isLiked: post.liked,
        }}
        title={post.title}
        content={
          <ReadOnly
            html={post.content}
            style={{
              margin: '0.5rem',
            }}
            borderd
          ></ReadOnly>
        }
        ago={ago}
        onClick={() => {
          setCurrentPost(post)
          nav(`/community/post/${post.id}`)
        }}
      ></GeneralCard>
    </Card>
  )
}

export default Element
