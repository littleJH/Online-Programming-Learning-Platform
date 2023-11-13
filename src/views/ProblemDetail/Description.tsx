import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import ReadOnly from '@/components/editor/Readonly'
import { Divider, Space, Table } from 'antd'
import Column from 'antd/es/table/Column'
import { useOutletContext } from 'react-router-dom'
import { ICaseSample, IProblem } from '@/type'

const ctnClassname = 'py-4'
const roClassname = ''
const titleClassname = 'font-semibold'

const Description: React.FC = () => {
  const [problem, caseSamples] = useOutletContext<[IProblem, ICaseSample[]]>()
  const [dataSource, setdataSource] = useState<{ key: string; input: string; output: string }[]>([])
  const [fetchDone, setfetchDone] = useState(false)
  const [mouseoverLike, setmouseoverLike] = useState(false)

  console.log('problemDetail ==> ', problem)

  useLayoutEffect(() => {
    caseSamples
      ? caseSamples.forEach((item, index) => {
          setdataSource((value) => [
            ...value,
            {
              key: String(item.cid),
              input: item.input,
              output: item.output
            }
          ])
        })
      : null
  }, [caseSamples])

  return (
    <div className='px-8'>
      {problem && (
        <>
          <div>
            <h3>{problem.title}</h3>
          </div>
          {/* <div className='h-4 flex text-xs text-slate-500'>
            <Space split={<Divider type='vertical'></Divider>}>
              <div
                onMouseOver={() => setmouseoverLike(true)}
                onMouseLeave={() => setmouseoverLike(false)}
              >
                <span>点赞：</span>
                <span>{problem.likeNum}</span>
              </div>
              <div>
                <span>点踩：</span>
                <span>{problem.dislikeNum}</span>
              </div>
              <div>
                <span>收藏：</span>
                <span>{problem.collectNum}</span>
              </div>
              <div>
                <span>浏览：</span>
                <span>{problem.visibleNum}</span>
              </div>
            </Space>
            <div className='grow text-end'>
              <span>{problem.created_at}</span>
            </div>
          </div> */}
          <Divider
            style={{
              margin: '1rem'
            }}
          ></Divider>
          <ReadOnly
            ctnClassName={ctnClassname}
            className={roClassname}
            title={<div className={titleClassname}>题目描述</div>}
            html={problem?.description}
          ></ReadOnly>

          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>输入格式</div>}
            html={problem?.input}
          ></ReadOnly>
          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>输出格式</div>}
            html={problem?.output}
          ></ReadOnly>
          <div className={ctnClassname}>
            <div className='font-bold'>示例</div>
            <Table
              size='small'
              className='m-4 '
              bordered
              dataSource={dataSource}
              pagination={false}
            >
              <Column
                title='input'
                key='input'
                dataIndex={'input'}
                render={(value) => {
                  return <div className='mx-4 min-w-max '>{value}</div>
                }}
              ></Column>
              <Column
                title='output'
                key='output'
                dataIndex={'output'}
                render={(value) => {
                  return <div className='mx-4 min-w-max '>{value}</div>
                }}
              ></Column>
            </Table>
          </div>
          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>时间限制</div>}
            html={`${problem?.time_limit} ms`}
          ></ReadOnly>
          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>空间限制</div>}
            html={`${problem?.memory_limit} kb`}
          ></ReadOnly>
          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>提示</div>}
            html={problem?.hint}
          ></ReadOnly>
          <ReadOnly
            ctnClassName={ctnClassname}
            title={<div className={titleClassname}>来源</div>}
            html={problem?.source}
          ></ReadOnly>
        </>
      )}
    </div>
  )
}

export default Description
