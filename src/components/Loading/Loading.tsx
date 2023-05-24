import { Spin } from 'antd'
import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spin size="large"></Spin>
    </div>
  )
}

export default Loading
