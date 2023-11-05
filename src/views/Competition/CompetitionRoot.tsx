import React from 'react'
import { Button, Space } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

const Competition: React.FC = () => {
  const nav = useNavigate()
  return (
    <div className='flex-grow h-full w-full flex justify-center'>
      <Outlet></Outlet>
    </div>
  )
}

export default Competition
{
  /* <div className="w-full flex justify-center items-center shadow mb-4 ">
        <div></div>
        <div className="">
          <Space>
            <Button onClick={() => nav('create')}>创建比赛</Button>
            <Button onClick={() => nav('list')}>查看比赛</Button>
            <Button onClick={() => nav('random/single')}>及时个人比赛</Button>
          </Space>
        </div>
      </div> */
}
