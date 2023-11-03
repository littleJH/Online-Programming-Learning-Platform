import { iconBaseUrl } from '@/config/apiConfig'
import { getUserInfoApi } from '@/api/user'
import { cancelLikeRemarkApi, getRemarkLikeNumApi, getRemarkLikedApi, likeRemarkApi } from '@/api/remark'
import { IRemark, User } from '@/type'
import { Avatar, Divider, Card } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReadOnly from '../editor/ReadOnly'
import GetTimeago from '@/tool/myFns/getTimeago'
import style from './style.module.scss'
import MySvgIcon from '../Icon/MySvgIcon'

const RemarkCard: React.FC<{
  remark: IRemark
}> = (props) => {
  const [remark, setremark] = useState<IRemark>(props.remark)

  useEffect(() => {
    const remarkObj = { ...remark }
    Promise.all([getRemarkLikedApi(remark.id), getRemarkLikeNumApi(remark.id, 'true'), getRemarkLikeNumApi(remark.id, 'false'), getUserInfoApi(remark.user_id)]).then((res) => {
      remarkObj.liked = res[0].data.data.like
      remarkObj.likeNum = res[1].data.data.total
      remarkObj.dislikeNum = res[2].data.data.total
      remarkObj.user = res[3].data.data.user
      setremark(remarkObj)
    })
  }, [props.remark])

  const ago = useMemo(() => {
    const ago = GetTimeago(remark.created_at)
    return `${ago.num}${ago.unit}前`
  }, [remark])

  const like = useCallback(
    (bool: boolean) => {
      likeRemarkApi(remark.id, bool ? 'true' : 'false').then(async (res) => {
        console.log(res.data)
        const { data } = await getRemarkLikeNumApi(remark.id)
        if (res.data.code === 200) {
          setremark((value) => {
            return {
              ...value,
              liked: bool ? 1 : -1,
              likeNum: data.data.total
            }
          })
        }
      })
    },
    [remark]
  )

  const calcelLike = useCallback(() => {
    cancelLikeRemarkApi(remark.id).then(async (res) => {
      console.log(res.data)
      const { data } = await getRemarkLikeNumApi(remark.id)
      if (res.data.code === 200) {
        setremark((value) => {
          return {
            ...value,
            liked: 0,
            likeNum: data.data.total
          }
        })
      }
    })
  }, [remark])

  const handleLikeClick = () => {
    remark.liked === 1 ? calcelLike() : like(true)
  }
  const handleDislikeClick = () => {
    remark.liked === -1 ? calcelLike() : like(false)
  }

  return (
    <Card className='w-full'>
      <div className='flex items-center'>
        <Avatar
          className='card-avatar'
          src={<img src={`${iconBaseUrl}/${remark.user?.icon}`}></img>}
        ></Avatar>
        <div className='card-username'>{remark.user?.name}</div>
        <div className='card-time'>{ago}</div>
      </div>
      <ReadOnly
        html={remark.content}
        className='mx-9'
      ></ReadOnly>
      <div className={`${style.remarkFooter} flex items-center ml-12`}>
        <div onClick={handleLikeClick}>
          <svg className='icon-small'>
            <use href={remark.liked === 1 ? '#icon-liked' : '#icon-like'}></use>
          </svg>
          <span>{remark.likeNum}</span>
        </div>

        <Divider type='vertical'></Divider>
        <div onClick={handleDislikeClick}>
          <MySvgIcon
            href={remark.liked === -1 ? '#icon-disliked' : '#icon-dislike'}
            size={1}
          ></MySvgIcon>
          <span>{remark.dislikeNum}</span>
        </div>
      </div>
    </Card>
  )
}

export default RemarkCard
