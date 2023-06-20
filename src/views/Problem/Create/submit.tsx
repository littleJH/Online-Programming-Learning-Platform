import React, { useMemo } from 'react'
import ReadOnly from '../../../components/Editor/ReadOnly'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'

interface DataSource {
  key: string
  value: string
}

const Submit: React.FC<{
  form: any
}> = props => {
  const problemForm = props.form.getFieldsValue(true)
  const formList: DataSource[] = useMemo(() => {
    const arr: DataSource[] = []
    Object.keys(problemForm).forEach((key: string, index: number) => {
      arr.push({
        key: key,
        value: problemForm[key]
      })
    })
    return arr
  }, [])
  console.log(formList)

  return (
    <div>
      <Table
        className="rounded shadow"
        bordered
        showHeader={false}
        dataSource={formList}
        pagination={false}
      >
        <Column title="key" dataIndex={'key'} key={'key'}></Column>
        <Column
          width={800}
          title="value"
          dataIndex={'value'}
          key={'value'}
          render={(value: any, record: any) => {
            if (
              [
                'sample_case',
                'test_case',
                'sample_case_expand',
                'test_case_expand'
              ].includes(record.key)
            ) {
              console.log(record.key)
              return null
              // <Table dataSource={value}>
              //   <Column title="input" dataIndex={'input'}></Column>
              // </Table>
            } else if (
              ['description', 'hint', 'input', 'output', 'source'].includes(
                record.key
              )
            ) {
              return (
                <ReadOnly className={'p-4 w-full'} value={value}></ReadOnly>
              )
            } else {
              return (
                <ReadOnly
                  className={'p-4  '}
                  value={[
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: String(value)
                        }
                      ]
                    }
                  ]}
                ></ReadOnly>
              )
            }
          }}
        ></Column>
      </Table>
      <div className="h-8"></div>
    </div>
  )
}

export default Submit
