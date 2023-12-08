import { Space, Card, theme } from 'antd'
import React, { useEffect } from 'react'
import useNavTo from '@/tool/myHooks/useNavTo'
import { useRecoilValue, useSetRecoilState } from 'recoil'
// import { sideBarCollapsed } from '@/store/appStore'

const lineClass = 'flex'
const itemClass =
  'h-48 w-80 m-8 rounded-xl flex  hover:cursor-pointer hover:-translate-y-4 transition-all duration-300 select-none'

const CreationNavgation: React.FC = () => {
  const nav = useNavTo()
  // const setSideBarCollapsed = useSetRecoilState(sideBarCollapsed)

  const handleClick = (e: string) => {
    nav(`${e}`)
    // setSideBarCollapsed(false)
  }

  return (
    <div>
      <div className={lineClass}>
        <Card
          id="problem"
          className={itemClass}
          onClick={() => handleClick('problem')}
          hoverable
        >
          <NavCard
            title="题目"
            content="点此创建题目"
            svgHref="#icon-problem"
          ></NavCard>
        </Card>
        <Card
          id="topic"
          className={itemClass}
          onClick={() => handleClick('topic')}
          hoverable
        >
          <NavCard
            title="题单"
            content="点此创建题单点"
            svgHref="#icon-topic"
          ></NavCard>
        </Card>
        <Card
          id="form"
          className={itemClass}
          onClick={() => handleClick('form')}
          hoverable
        >
          <NavCard
            title="表单"
            content="点此创建表单"
            svgHref="#icon-liebiaoqingdan"
          ></NavCard>
        </Card>
      </div>
      <div className={lineClass}>
        <Card
          id="article"
          className={itemClass}
          onClick={() => handleClick('article')}
          hoverable
        >
          <NavCard
            title="文章"
            content="点此创建文章"
            svgHref="#icon-article"
          ></NavCard>
        </Card>
        <Card
          id="comment"
          className={itemClass}
          onClick={() => handleClick('comment')}
          hoverable
        >
          <NavCard
            title="讨论"
            content="点此创建讨论"
            svgHref="#icon-discuss"
          ></NavCard>
        </Card>
        <Card
          id="post"
          className={itemClass}
          onClick={() => handleClick('post')}
          hoverable
        >
          <NavCard
            title="题解"
            content="点此创建题解"
            svgHref="#icon-post"
          ></NavCard>
        </Card>
      </div>
      <div className={lineClass}>
        <Card
          id="competition"
          className={itemClass}
          onClick={() => handleClick('competition')}
          hoverable
        >
          <NavCard
            title="比赛"
            content="点此创建比赛"
            svgHref="#icon-competition"
          ></NavCard>
        </Card>
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
  const { token } = theme.useToken()
  return (
    <Space direction="vertical" className="w-full">
      <div className="h-12 flex items-center">
        <svg className="icon">
          <use href={svgHref}></use>
        </svg>
      </div>
      <div className="h-8 font-semibold">{title}</div>
      <div
        className="text-base h-12 w-full"
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: token.colorTextDescription,
        }}
      >
        {content}
      </div>
    </Space>
  )
}
