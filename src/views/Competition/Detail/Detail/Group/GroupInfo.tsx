import UserCard from '@/components/User/UserCard'
import { IGroup } from '@/vite-env'
import React from 'react'
import style from './group.module.scss'

const GroupInfo: React.FC<{
  group: IGroup
}> = props => {
  const { group } = props
  return (
    <div className="flex flex-col items-start max-w-max">
      <p>
        <span className={style.label}>小组名：</span>
        <span className={style.value}>{group.title}</span>
      </p>
      <p>
        <span className={style.label}>小组id: </span>
        <span className={style.value}>{group.id}</span>
      </p>
      <p>
        <span className={style.label}>小组描述: </span>
        <span className={style.value}>{group.content}</span>
      </p>
      <p>
        <span className={style.label}>自动通过用户申请: </span>
        <span className={style.value}>{group.auto ? '是' : '否'}</span>
      </p>
      <p>
        <span className={style.label}>组长id: </span>
        <span className={style.value}>{group.leader_id}</span>
      </p>
      <p>
        <span className={style.label}>比赛结束时间: </span>
        <span className={style.value}>{group.competition_at}</span>
      </p>
      <p>
        <span className={style.label}>创建于: </span>
        <span className={style.value}>{group.created_at}</span>
      </p>
      {group?.members && (
        <div>
          <p>小组成员：</p>
          {group.members?.map(item => {
            return <UserCard key={item.id} user={item}></UserCard>
          })}
        </div>
      )}
    </div>
  )
}

export default GroupInfo
