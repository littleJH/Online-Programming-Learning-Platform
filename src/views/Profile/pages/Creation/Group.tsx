import { deleteGroupApi, getGroupListApi, getLeaderGroupListApi } from '@/api/group'
import { notificationApi, userInfoState } from '@/store/appStore'
import { IGroup } from '@/type'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { List, Button, Popconfirm, Modal } from 'antd'
import GroupInfo from '@/components/Group/GroupInfo'
import PaginationList from '@/components/List/PaginationList'
import { useSearchParams } from 'react-router-dom'

const Group: React.FC = () => {
  const [querys, setQuerys] = useSearchParams()
  const info = useRecoilValue(userInfoState)
  const [groupList, setGroupList] = useState<IGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<IGroup>()
  const notification = useRecoilValue(notificationApi)
  const [pageNum, setPageNum] = useState(Number(querys.get('pageNum')) || 1)
  const [pageSize, setPageSize] = useState(Number(querys.get('pageSize')) || 10)
  const [total, setTotal] = useState(0)

  React.useEffect(() => {
    setQuerys((search) => {
      search.set('pageNum', String(pageNum))
      search.set('pageSize', String(pageSize))
      return search
    })
    fetchGroups()
  }, [pageNum, pageSize])

  const fetchGroups = () => {
    info?.id &&
      getLeaderGroupListApi(info?.id).then((res) => {
        setGroupList(res.data.data.groups)
        setTotal(res.data.data.total)
        setLoading(false)
      })
  }

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

  const handleDetail = (item: any, index: number) => {
    setCurrentGroup(item)
    setOpenDetailModal(true)
  }

  const handleUpdate = (item: any, index: number) => {}

  const handlePageChange = (pageNum: number, pageSize: number) => {
    setPageNum(pageNum)
    setPageSize(pageSize)
  }

  return (
    <div>
      <PaginationList
        dataSource={groupList}
        loading={loading}
        onDelete={handleDelete}
        onDetail={handleDetail}
        onUpdate={handleUpdate}
        pageNum={pageNum}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        itemRender={(item: IGroup) => (
          <List.Item.Meta
            title={item.title}
            description={item.content}
          ></List.Item.Meta>
        )}
      ></PaginationList>
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
