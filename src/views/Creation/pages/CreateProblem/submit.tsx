import React, { useMemo } from 'react'
import ReadOnly from '../../../../components/editor/Readonly'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import { string } from 'slate'

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
        value: problemForm[key],
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
            console.log(value, typeof value)
            switch (typeof value) {
              case 'string':
                return (
                  <ReadOnly
                    className={'p-4'}
                    html={value.includes('<p>') ? value : `<p>${value}<p/>`}
                  ></ReadOnly>
                )
              case 'object':
                return
              default:
                break
            }
          }}
        ></Column>
      </Table>
      <div className="h-8"></div>
    </div>
  )
}

export default Submit
