import { Space, Tooltip } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import style from './style.module.scss'

const lineClass = 'flex'
const itemClass =
  'h-48 w-80 m-8 p-4 bg-slate-50  rounded-xl shadow flex  hover:cursor-pointer hover:shadow-lg hover:-translate-y-4 transition-all duration-300 select-none'

const CreationNavgation: React.FC = () => {
  const nav = useNavigate()

  const handleClick = (e: string) => {
    nav(`${e}`)
  }

  return (
    <div>
      <div className={lineClass}>
        <div
          id="problem"
          className={itemClass}
          onClick={() => handleClick('problem')}
        >
          <NavCard
            title="题目"
            content="点此创建题目点此创建题目"
            svgHref="#icon-problem"
          ></NavCard>
        </div>
        <div
          id="topic"
          className={itemClass}
          onClick={() => handleClick('topic')}
        >
          <NavCard
            title="题单"
            content="点此创建题单点此创建题单点此创建题单点此创建题单点此创建题单"
            svgHref="#icon-topic"
          ></NavCard>
        </div>
        <div
          id="form"
          className={itemClass}
          onClick={() => handleClick('form')}
        >
          <NavCard
            title="表单"
            content="点此创建表单"
            svgHref="#icon-liebiaoqingdan"
          ></NavCard>
        </div>
      </div>
      <div className={lineClass}>
        <div
          id="competition"
          className={itemClass}
          onClick={() => handleClick('competition')}
        >
          <NavCard
            title="比赛"
            content="点此创建比赛"
            svgHref="#icon-competition"
          ></NavCard>
        </div>
      </div>
      <div className={lineClass}>
        <div
          id="article"
          className={itemClass}
          onClick={() => handleClick('article')}
        >
          <NavCard
            title="文章"
            content="点此创建文章"
            svgHref="#icon-article"
          ></NavCard>
        </div>
        <div
          id="comment"
          className={itemClass}
          onClick={() => handleClick('comment')}
        >
          <NavCard
            title="讨论"
            content="点此创建讨论"
            svgHref="#icon-discuss"
          ></NavCard>
        </div>
        <div
          id="post"
          className={itemClass}
          onClick={() => handleClick('post')}
        >
          <NavCard
            title="题解"
            content="点此创建题解"
            svgHref="#icon-post"
          ></NavCard>
        </div>
      </div>
    </div>
  )
}

export default CreationNavgation

const NavCard: React.FC<{
  svgHref: string
  title: string
  content: string
}> = props => {
  const { svgHref, title, content } = props
  return (
    <Space direction="vertical" className='w-full'>
      <div className="h-12 flex items-center">
        <svg className="icon">
          <use href={svgHref}></use>
        </svg>
      </div>
      <div className="h-8 font-semibold">{title}</div>
      <div
        className="text-base text-slate-500 h-12 w-full"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {content}
      </div>
    </Space>
  )
}
