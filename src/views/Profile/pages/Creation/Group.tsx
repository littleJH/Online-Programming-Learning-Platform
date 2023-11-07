import { deleteGroupApi, getGroupListApi, getLeaderGroupListApi } from '@/api/group'
import { notificationApi, userInfoState } from '@/store/appStore'
import { IGroup } from '@/type'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { List, Button, Popconfirm, Modal } from 'antd'
import GroupInfo from '@/components/Group/GroupInfo'

const Group: React.FC = () => {
  const info = useRecoilValue(userInfoState)
  const [groupList, setGroupList] = useState<IGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<IGroup>()
  const notification = useRecoilValue(notificationApi)

  React.useEffect(() => {
    info?.id &&
      getLeaderGroupListApi(info?.id).then((res) => {
        setGroupList(res.data.data.groups)
        setLoading(false)
      })
  }, [info])

  const handleDelete = async (group: IGroup, index: number) => {
    console.log(index)
    const { data } = await deleteGroupApi(group.id)
    if (data.code === 200) {
      setGroupList((value) => [...value.slice(0, index), ...value.slice(index + 1)])
      notification &&
        notification.success({
          message: `用户组“${group.title}”已删除`
        })
    }
  }

  return (
    <div>
      <List
        dataSource={groupList}
        loading={loading}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                type='link'
                style={{ padding: '0' }}
                onClick={() => {
                  setCurrentGroup(item)
                  setOpenDetailModal(true)
                }}
              >
                详情
              </Button>,
              <Button
                style={{ padding: '0' }}
                type='link'
              >
                更新
              </Button>,
              <Popconfirm
                title='确定删除该文章？'
                okText='确认'
                cancelText='取消'
                onConfirm={() => handleDelete(item, index)}
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
            <List.Item.Meta
              title={item.title}
              description={item.content}
            ></List.Item.Meta>
          </List.Item>
        )}
      ></List>
      <Modal
        open={openDetailModal}
        onCancel={() => setOpenDetailModal(false)}
        footer={[]}
      >
        {currentGroup && <GroupInfo group={currentGroup}></GroupInfo>}
      </Modal>
    </div>
  )
}

export default Group
