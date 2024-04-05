import React, { useEffect, useState } from 'react'
import style from '../style.module.scss'
import { useParams } from 'react-router-dom'
import { INotice } from '@/type'
import ReadOnly from '@/components/editor/Readonly'
import { Button, Card, Divider, Popconfirm, Space, theme } from 'antd'
import { deleteNoticeBoardApi, getNoticeBoardApi } from '@/api/noticeboard'
import { getUserInfoApi } from '@/api/user'
import { useRecoilValue } from 'recoil'
import { notificationApi, userInfoState } from '@/store/appStore'
import myHooks from '@/tool/myHooks/myHooks'

const NoticeDetail: React.FC = () => {
  const nav = myHooks.useNavTo()
  const { notice_id = '' } = useParams()
  const [notice, setNotice] = useState<INotice>()
  const currentUser = useRecoilValue(userInfoState)
  const { token } = theme.useToken()
  const notification = useRecoilValue(notificationApi)

  useEffect(() => {
    fetchDetail()
  }, [])

  const fetchDetail = async () => {
    try {
      const notice = (await getNoticeBoardApi(notice_id)).data.data.notice
      const user = (await getUserInfoApi(notice.user_id)).data.data.user
      notice.user = user
      setNotice(notice)
    } catch {}
  }

  const handleUpdate = () => {
    nav(`/creation/notice?id=${notice_id}`)
  }
  const handleDelete = async () => {
    try {
      const res = (await deleteNoticeBoardApi(notice_id)).data
      if (res.code === 200) {
        notification &&
          notification.success({
            message: '删除成功',
          })
        window.history.back()
      } else {
        notification &&
          notification.error({
            message: res.msg,
          })
      }
    } catch {}
  }
  return (
    <div className={style.noticeDetail}>
      {notice && (
        <Card>
          <h1 className={style.title}>{notice.title}</h1>
          <div
            className={style.authorLine}
            style={{
              color: token.colorTextDescription,
            }}
          >
            <Space>
              <span>{notice.user?.name}</span>
              <span>{notice.updated_at}</span>
            </Space>
            {notice.user?.name === currentUser?.name && (
              <div className={style.editBox}>
                <Space>
                  <Button size="small" type="dashed" onClick={handleUpdate}>
                    编辑
                  </Button>
                  <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={handleDelete}>
                    <Button size="small" type="dashed" danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            )}
          </div>
          <Divider></Divider>
          <ReadOnly html={notice.content}></ReadOnly>
        </Card>
      )}
    </div>
  )
}

export default NoticeDetail
