import { showProblemApi } from '@/api/problem'
import ReadOnly from '@/components/Editor/ReadOnly'
import { IHack, IProblem, IRecord, User } from '@/type'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Highlight from '@/components/Editor/Highlight'
import { getUserInfoApi } from '@/api/user'

interface IProps {
  hack: IHack
  record: IRecord
}

const HackDetail: React.FC<IProps> = props => {
  const { hack, record } = props
  const [problem, setproblem] = useState<IProblem>({} as IProblem)
  const [userInfo, setuserInfo] = useState<User>({} as User)
  useEffect(() => {
    showProblemApi(record?.problem_id).then(res => {
      setproblem(res.data.data.problem)
    })
    getUserInfoApi(hack.user_id).then(res => {
      setuserInfo(res.data.data.user)
    })
  }, [record])
  return (
    <div>
      <p className="flex">
        <div>作者：</div>
        <NavLink className={'hover:cursor-pointer'} to={``}>
          {userInfo.name}
        </NavLink>
      </p>
      <p className="flex">
        <div>题目：</div>
        <NavLink
          className={'hover:cursor-pointer'}
          to={`/problem/${problem.id}`}
        >
          {problem.title}
        </NavLink>
      </p>
      <p className="">
        <div>Hack Input：</div>
        <div className="border border-solid border-slate-500 rounded p-4 my-2">
          {hack.input}
        </div>
      </p>
      <Highlight code={record.code}></Highlight>
    </div>
  )
}

export default HackDetail
