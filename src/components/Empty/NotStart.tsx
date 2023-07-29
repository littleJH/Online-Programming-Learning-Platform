import React from 'react'

const NotStart: React.FC = () => {
  return (
    <div className="h-24 flex justify-center items-center">
      <svg className="icon mx-4">
        <use href="#icon-weikaishi"></use>
      </svg>
      <div className="text-slate-500">比赛尚未开始</div>
    </div>
  )
}

export default NotStart
