import {searchProblemByTextApi, showProblemApi} from '@/api/problem'
import ReadOnly from '@/components/editor/Readonly'
import {
  Button,
  InputNumber,
  List,
  Popover,
  Select,
  Space,
  Spin,
  notification
} from 'antd'
import {MinusCircleOutlined} from '@ant-design/icons'
import React, {Fragment, useEffect, useState} from 'react'
import ProblemNew from './ProblemNew'
import {
  getProblemNewApi,
  getProblemNewListApi,
  quoteProblemApi,
  deleteProblemNewApi,
  updateProblemNewApi
} from '@/api/problemNew'
import {ICompetition} from '@/type'
import useNavTo from '@/tool/myHooks/useNavTo'
import {useParams, useSearchParams} from 'react-router-dom'

interface IProblem {
  id: string
  score: string | ''
  title: string
  description: string
}

let timeout: ReturnType<typeof setTimeout> | null
let currentValue: string

const fetch = (value: string, setoptions: Function) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  const fake = () => {
    searchProblemByTextApi(value).then((res) => {
      console.log(res)
      if (!res.data.data.problems) {
        setoptions([])
        return
      } else {
        if (currentValue === value) {
          const data = res.data.data.problems.map((item: any, index: any) => ({
            value: item.title,
            label: item.title,
            key: item.id
          }))
          setoptions(data)
        }
      }
    })
  }

  if (value) {
    timeout = setTimeout(fake, 300)
  } else {
    setoptions([])
  }
}

const Problem: React.FC = () => {
  const nav = useNavTo()
  const [querys] = useSearchParams()
  const competition_id = querys.get('competition_id')
  const [problemList, setproblemList] = useState<IProblem[]>([])
  const [searching, setsearching] = useState(false)
  const [options, setoptions] = useState([])
  const [selectValue, setselectValue] = useState([])
  const [isModelOpen, setisModelOpen] = useState(false)

  useEffect(() => {
    initProblemList()
  }, [competition_id])

  const initProblemList = async () => {
    if (!competition_id) return
    const {data} = await getProblemNewListApi(competition_id)
    if (data.data.problemIds) {
      data.data.problemIds.forEach(async (id: string, index: number) => {
        const {data} = await getProblemNewApi(id)
        console.log('problemNew', data)
        console.log(data)
        setproblemList((value: IProblem[]) => [
          ...value,
          {
            id: data.data.problem.id,
            score: data.data.problem.score,
            title: data.data.problem.title,
            description: data.data.problem.description
          }
        ])
      })
    }
  }

  const search = (value: string) => {
    setselectValue([])
    fetch(value, setoptions)
  }

  const handleSelect = (option: any) => {
    console.log(option)
    showProblemApi(option.key).then((res) => {
      console.log(res)
      setproblemList((value) => [
        ...value,
        {
          id: res.data.data.problem.id,
          score: '1',
          title: res.data.data.problem.title,
          description: res.data.data.problem.description
        }
      ])
    })
  }

  const handleDelete = (index: number) => {
    console.log(index)
    setproblemList((value) => [
      ...value.slice(0, index),
      ...value.slice(index + 1)
    ])
    deleteProblemNewApi(problemList[index].id).then((res) => {
      console.log(res.data)
    })
  }

  const handleScoreChange = async (value: any, index: number) => {
    const list = [...problemList]
    list[index].score = value
    setproblemList(list)
  }

  const handleItemClick = (id: string) => {
    nav(`/problemdetail/${id}/description`)
  }

  const handleSubmit = () => {
    for (let problem of problemList) addProblem(problem)
  }

  const addProblem = async (problem: IProblem) => {
    if (!competition_id) return
    let resState: {
      code: number
      msg: string
    } = {code: 0, msg: ''}
    const {id, score} = problem
    const {data} = await getProblemNewApi(id)
    console.log(data)
    if (data.data) {
      const problem = {...data.data.problem}
      problem.score = score
      delete problem.create_at
      delete problem.id
      delete problem.updated_at
      delete problem.user_id
      await updateProblemNewApi(id, JSON.stringify(problem)).then((res) => {
        console.log('update', res)
        resState = {
          code: res.data.code,
          msg: res.data.msg
        }
      })
    } else {
      await quoteProblemApi(competition_id, id, score).then((res) => {
        console.log('quote', res)
        console.log(res)
        resState = {
          code: res.data.code,
          msg: res.data.msg
        }
      })
    }
    if (resState.code === 200) {
      notification.success({
        message: resState.msg
      })
    } else {
      notification.success({
        message: resState.msg
      })
    }
  }

  return (
    <div className='w-full'>
      <Select
        size='large'
        showSearch
        mode='multiple'
        value={selectValue}
        placeholder='Search problem ...'
        defaultActiveFirstOption={false}
        filterOption={false}
        onSearch={search}
        onChange={(newValue) => setselectValue(newValue)}
        onSelect={handleSelect}
        className='w-full'
        labelInValue
        notFoundContent={searching ? <Spin size='small'></Spin> : null}
        options={options}
        autoFocus={true}></Select>
      {/* <Table dataSource={dataSource}></Table> */}
      <List
        style={{width: '100%'}}
        itemLayout='horizontal'
        dataSource={problemList}
        renderItem={(item: IProblem, index) => (
          <Fragment>
            <List.Item
              actions={[
                <Button
                  type='text'
                  danger
                  shape='circle'
                  onClick={() => handleDelete(index)}
                  icon={<MinusCircleOutlined />}></Button>
              ]}>
              <List.Item.Meta
                description={
                  <Popover
                    mouseEnterDelay={0.3}
                    overlayStyle={{
                      maxWidth: '512px'
                    }}
                    overlayInnerStyle={{
                      maxHeight: '256px',
                      overflow: 'scroll'
                    }}
                    title={item.title}
                    content={
                      <ReadOnly style={{}} html={item.description}></ReadOnly>
                    }>
                    <div
                      className='hover:cursor-pointer text-indigo-500 min-w-max'
                      onClick={() => handleItemClick(item.id)}>
                      {item.title}
                    </div>
                  </Popover>
                }></List.Item.Meta>
              <div className=''>
                <span>分数：</span>
                <InputNumber
                  min={'0'}
                  defaultValue={item.score}
                  onChange={(value) =>
                    handleScoreChange(value, index)
                  }></InputNumber>
              </div>
            </List.Item>
          </Fragment>
        )}></List>
      <Space className='flex justify-center'>
        {/* <Button
          onClick={() => {
            setisModelOpen(true)
          }}
        >
          创建赛内题目
        </Button> */}
        <Button
          onClick={() =>
            nav(
              `/creation/competition/competition?competition_id=${competition_id}`
            )
          }>
          上一步
        </Button>
        <Button type='primary' onClick={handleSubmit}>
          保存
        </Button>
      </Space>
      {isModelOpen && (
        <ProblemNew
          open={isModelOpen}
          setisModelOpen={setisModelOpen}></ProblemNew>
      )}
    </div>
  )
}

export default Problem
