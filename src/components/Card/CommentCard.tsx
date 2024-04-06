import { IComment } from '@/type'
import React, { useEffect, useMemo, useState } from 'react'
import GeneralCard from './GeneralCard'
import { getCommentLikeNumApi, getCommentLikedApi } from '@/api/comment'
import { getUserInfoApi } from '@/api/user'
import utils from '@/tool/myUtils/utils'
import { Button, Card, Modal } from 'antd'
import ReadOnly from '../editor/Readonly'
import { createCommentReplyApi, getCommentReplyListApi } from '@/api/reply'
import RemarkCard from './RemarkCard'
import NoData from '../empty/NoData'
import TextEditor from '../editor/TextEditor'

interface IProps {
  commentProps: IComment
  onClick?: Function
  mode?: 'default' | 'action'
  showReply?: boolean
  style?: React.CSSProperties
}

const CommentCard: React.FC<IProps> = (props) => {
  const { commentProps, onClick, mode = 'default', showReply, style } = props
  const [comment, setComment] = useState<IComment>(commentProps)
  const [replyContent, setreplyContent] = useState('')
  const [openReplyModal, setopenReplyModal] = useState(false)

  const ago = useMemo(() => {
    console.log('comment ==> ', comment)

    const { num, unit } = utils.getTimeAgo(comment.created_at)
    return `${num}${unit}前`
  }, [comment])

  useEffect(() => {
    fetchDetail()
  }, [])

  const fetchDetail = async () => {
    try {
      const clone = { ...commentProps }
      const res = await Promise.all([
        getCommentLikedApi(commentProps.id),
        getCommentLikeNumApi(commentProps.id),
        getUserInfoApi(commentProps.user_id),
      ])
      clone.liked = res[0].data.data.like
      clone.likeNum = res[1].data.data.total
      clone.user = res[2].data.data.user
      clone.reply = showReply ? (await getCommentReplyListApi(commentProps.id)).data.data : null
      setComment(clone)
    } catch {}
  }

  const handleSubmitReplyClick = () => {
    console.log(replyContent)
    createCommentReplyApi(
      comment.id,
      JSON.stringify({
        content: replyContent,
      })
    ).then(async (res) => {
      if (res.data.code === 200) {
        setopenReplyModal(false)
        setreplyContent('')
        const { data } = await getCommentReplyListApi(comment.id)
        setComment((value) => ({
          ...value,
          reply: data.data,
        }))
      }
    })
  }

  return (
    <Card style={style} size="small">
      <GeneralCard
        user={comment?.user}
        liked={{
          count: comment.likeNum,
          isLiked: comment.liked,
        }}
        content={<ReadOnly html={comment.content}></ReadOnly>}
        ago={ago}
        footer={
          comment.reply ? (
            <Button type="dashed" size="small" onClick={() => setopenReplyModal(true)}>
              # 我有一言
            </Button>
          ) : null
        }
        extra={
          showReply ? (
            <div>
              <div>
                <h4>
                  回复 (<span>{comment.reply?.total || 0}</span>)
                </h4>
                {comment.reply &&
                  comment.reply.replys.map((item, index) => {
                    return <RemarkCard remark={item} key={item.id}></RemarkCard>
                  })}
              </div>
              <Modal
                open={openReplyModal}
                onCancel={() => setopenReplyModal(false)}
                footer={[
                  <Button key="submit" type="primary" onClick={handleSubmitReplyClick}>
                    发布
                  </Button>,
                ]}
                title={'我有一言'}
              >
                <TextEditor
                  mode="markdown"
                  value={replyContent}
                  htmlChange={(value: string) => setreplyContent(value)}
                  placeholder="发表我的看法~~~"
                ></TextEditor>
              </Modal>
            </div>
          ) : null
        }
      ></GeneralCard>
    </Card>
  )
}

export default CommentCard
