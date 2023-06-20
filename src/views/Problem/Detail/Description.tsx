import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import ReadOnly from '@/components/Editor/ReadOnly'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import { useOutletContext } from 'react-router-dom'
import { ICaseSample } from '@/vite-env'

const Description: React.FC = () => {
  const [problem, caseSamples] = useOutletContext<[any, ICaseSample[]]>()
  const [dataSource, setdataSource] = useState<
    { key: string; input: string; output: string }[]
  >([])

  useLayoutEffect(() => {
    caseSamples
      ? caseSamples.forEach((item, index) => {
          setdataSource(value => [
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
    <div className="p-8">
      {problem && (
        <Fragment>
          <ReadOnly
            className="my-4"
            editableClassName="text-base bg-gray-100 rounded px-8 py-2"
            title="题目描述"
            value={JSON.parse(problem?.description)}
          ></ReadOnly>
          <ReadOnly
            title="时间限制"
            text={[`${problem?.time_limit} ms`]}
          ></ReadOnly>
          <ReadOnly
            title="空间限制"
            text={[`${problem?.memory_limit} kb`]}
          ></ReadOnly>
          <ReadOnly
            title={'输入格式'}
            value={JSON.parse(problem?.input)}
          ></ReadOnly>
          <ReadOnly
            title={'输出格式'}
            value={JSON.parse(problem?.output)}
          ></ReadOnly>
          <div className="font-bold">示例</div>
          <Table
            className="m-4"
            bordered
            dataSource={dataSource}
            pagination={false}
          >
            <Column title="input" dataIndex={'input'}></Column>
            <Column title="output" dataIndex={'output'}></Column>
          </Table>
          <ReadOnly title="提示" value={JSON.parse(problem?.hint)}></ReadOnly>
          <ReadOnly title="来源" value={JSON.parse(problem?.source)}></ReadOnly>
        </Fragment>
      )}
    </div>
  )
}

export default Description
