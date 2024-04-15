import myHooks from '@/tool/myHooks/myHooks'
import { Card, Divider, Input, Menu, Segmented, Statistic, theme } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import style from './style.module.scss'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import HotRank from '@/components/Rank/GeneralRank'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { getProblemHotRankApi, getProblemListApi, showProblemApi } from '@/api/problem'
import { getTopicApi, getTopicHotRankApi } from '@/api/topic'
import { getFormApi, getFormHotRankApi } from '@/api/form'

interface IRank {
  id: string
  title: string
  score: number
  type: string
}

const ProblemSetRoot: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const pathname = useRecoilValue(pathNameState)
  const nav = myHooks.useNavTo()
  const [rankList, setRankList] = useState<IRank[]>([])
  const [searchText, setSearchText] = useState(utils.getQuerys(location.search)?.text || '')
  const { token } = theme.useToken()

  const type = useMemo(() => utils.getPathArray(pathname)[1], [pathname])

  useEffect(() => {
    fetch(type)
  }, [type])

  const fetch = async (type: string) => {
    let list = []
    try {
      switch (type) {
        case 'all':
          const problems = (await getProblemListApi()).data.data.problems
          for (let problem of problems) {
            const data = (await showProblemApi(problem.id)).data.data
            list.push({
              title: (
                <div
                  style={{
                    padding: '0.5rem 0',
                  }}
                >
                  {data.problem.title}
                </div>
              ),
              score: problem.Score,
              type: type,
              id: problem.id,
            })
          }
          break
        case 'topic':
          const topics = (await getTopicHotRankApi()).data.data.topics
          for (let topic of topics) {
            const data = (await getTopicApi(topic.id)).data.data
            list.push({
              title: data.topic.title,
              score: topic.Score,
              type: type,
              id: topic.id,
            })
          }
          break
        case 'form':
          const forms = (await getFormHotRankApi()).data.data.forms
          for (let form of forms) {
            const data = (await getFormApi(form.id)).data.data
            list.push({
              title: data.form.title,
              score: form.Score,
              type: type,
              id: form.id,
            })
          }
          break
        default:
          break
      }
    } catch {}

    console.log('ranklist ==> ', list)
    setRankList(list)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    nav(`/problemset/${utils.getPathArray(pathname)[1]}?text=${value}`)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      nav(`/problemset/${utils.getPathArray(pathname)[1]}`)
      setSearchText('')
    }
  }

  const handleSegmentedChange = (value: string) => {
    nav(`/problemset/${value}`)
  }

  const handleRankClick = (index: number) => {}

  return (
    <div className={style.root}>
      <div className={style.left}>
        {/* <div className={style.header}>
          <Input.Search
            className={style.search}
            size="large"
            defaultValue={searchText}
            placeholder="搜索题目、题单、表单 ......"
            enterButton
            onSearch={handleSearch}
            onChange={handleSearchChange}
          ></Input.Search>
        </div> */}

        <Card
          title={
            <div className={style.title}>
              <MySvgIcon
                color={searchText === '' ? '' : token.colorPrimary}
                href={`${searchText === '' ? 'recommand' : 'search'}`}
                size={2}
              ></MySvgIcon>
              <span className="ml-2">
                {searchText === ''
                  ? `${recommandOptions.find((item) => item.value === type)?.label}推荐`
                  : `搜索结果：${searchText}`}
              </span>
            </div>
          }
          extra={
            <Segmented defaultValue={type} options={recommandOptions} onChange={handleSegmentedChange}></Segmented>
          }
          className={style.body}
        >
          <Outlet></Outlet>
        </Card>
      </div>
      <div className={style.right}>
        <HotRank icon="fire" rankList={rankList} onClick={(index: number) => handleRankClick(index)}></HotRank>
      </div>
    </div>
  )
}

export default ProblemSetRoot

const recommandOptions = [
  {
    key: 'all',
    value: 'all',
    label: '题目',
  },
  {
    key: 'topic',
    value: 'topic',
    label: '题单',
  },
  {
    key: 'form',
    value: 'form',
    label: '表单',
  },
]
