import React, { useEffect } from 'react'
import TextEditor from '@/components/editor/TextEditor'
import { Button, Form, Input, Select, Col, Row, InputNumber } from 'antd'
import { IProblem } from '@/type'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'

interface Iprops {
  form: any
}

const initLocalProblemForm = {
  title: '',
  description: '',
  time_limit: '',
  time_unit: '',
  memory_limit: '',
  memory_unit: '',
  input: '',
  output: '',
  sample_case: { input: '', output: '' },
  test_case: { input: '', output: '' },
  hint: '',
  source: ''
}

let problemForm = initLocalProblemForm

const Problem: React.FC<Iprops> = props => {
  const { form } = props
  const { Option } = Select

  useEffect(() => {
    problemForm = localStorage.getItem('problemForm')
      ? (JSON.parse(localStorage.getItem('problemForm') as string) as IProblem)
      : initLocalProblemForm
    form.setFieldsValue(problemForm)
  }, [])

  const textChange = (value: any, name: string) => {
    form.setFieldValue(name, value)
  }

  const handleFormChange = () => {
    localStorage.setItem('problemForm', JSON.stringify(form.getFieldsValue()))
  }

  return (
    <Form
      form={form}
      name="problemForm"
      layout="vertical"
      onValuesChange={handleFormChange}
      scrollToFirstError
    >
      <Form.Item name={'title'} label="标题" rules={[{ required: true }]}>
        <Input></Input>
      </Form.Item>
      <Form.Item name={'description'} label="描述" rules={[{ required: true }]}>
        <TextEditor
          mode="markdown"
          htmlChange={(value: any) => textChange(value, 'description')}
          defaultHtml={problemForm.description}
        ></TextEditor>
      </Form.Item>
      <Form.Item label="限制" name={'limit'} rules={[{ required: true }]}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item name={'time_limit'} noStyle rules={[{ required: true }]}>
              <InputNumber
                min={1}
                placeholder="时间限制"
                addonAfter={
                  <Form.Item
                    name={'time_unit'}
                    rules={[{ required: true }]}
                    noStyle
                  >
                    <Select placeholder="请选择" style={{ width: 80 }}>
                      <Option value="s">s</Option>
                      <Option value="ms">ms</Option>
                    </Select>
                  </Form.Item>
                }
              ></InputNumber>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={'memory_limit'}
              noStyle
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                placeholder="空间限制"
                addonAfter={
                  <Form.Item
                    name={'memory_unit'}
                    rules={[{ required: true }]}
                    noStyle
                  >
                    <Select placeholder="请选择" style={{ width: 80 }}>
                      <Option value="kb">kb</Option>
                      <Option value="mb">mb</Option>
                      <Option value="gb">gb</Option>
                    </Select>
                  </Form.Item>
                }
              ></InputNumber>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item name={'input'} label="输入格式" rules={[{ required: true }]}>
        <TextEditor
          mode="markdown"
          defaultHtml={problemForm.input}
          htmlChange={(value: any) => textChange(value, 'input')}
        ></TextEditor>
      </Form.Item>
      <Form.Item name={'output'} label="输出格式" rules={[{ required: true }]}>
        <TextEditor
          mode="markdown"
          defaultHtml={problemForm.output}
          htmlChange={(value: any) => textChange(value, 'output')}
        ></TextEditor>
      </Form.Item>
      <Form.Item label={`示例`} required>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['sample_case', 'input']}
              noStyle
              rules={[{ required: true }]}
            >
              <TextArea placeholder="input" autoSize></TextArea>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['sample_case', 'output']}
              noStyle
              rules={[{ required: true }]}
            >
              <TextArea placeholder="output" autoSize></TextArea>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.List name={'sample_case_expand'}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, name, index) => (
              <Form.Item
                colon={false}
                label={
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                }
                key={field.key}
              >
                <Form.Item noStyle>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name={[name, 'input']} noStyle>
                        <TextArea placeholder="input" autoSize></TextArea>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={[name, 'output']} noStyle>
                        <TextArea placeholder="output" autoSize></TextArea>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Form.Item>
            ))}
            <Form.Item colon={false} style={{ width: '100%' }}>
              <Button
                className="text-slate-500"
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                示例
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item label={`用例`} required>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              noStyle
              name={['test_case', 'input']}
              rules={[{ required: true }]}
            >
              <TextArea placeholder="input" autoSize></TextArea>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              noStyle
              name={['test_case', 'output']}
              rules={[{ required: true }]}
            >
              <TextArea placeholder="output" autoSize></TextArea>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>
      <Form.List name={'test_case_expand'}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, name, index) => (
              <Form.Item
                colon={false}
                label={
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                }
                key={field.key}
              >
                <Form.Item noStyle>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        noStyle
                        name={[name, 'input']}
                        rules={[{ required: true }]}
                      >
                        <TextArea placeholder="input" autoSize></TextArea>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        noStyle
                        name={[name, 'output']}
                        rules={[{ required: true }]}
                      >
                        <TextArea placeholder="output" autoSize></TextArea>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Form.Item>
            ))}
            <Form.Item colon={false}>
              <Button
                className="text-slate-500"
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                用例
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item name={'hint'} label="提示">
        <TextEditor
          mode="markdown"
          defaultHtml={problemForm.hint}
          htmlChange={(value: any) => textChange(value, 'hint')}
        ></TextEditor>
      </Form.Item>
      <Form.Item name={'source'} label="来源">
        <TextEditor
          mode="markdown"
          defaultHtml={problemForm.source}
          htmlChange={(value: any) => textChange(value, 'source')}
        ></TextEditor>
      </Form.Item>
    </Form>
  )
}

const formitemlayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
}

export default Problem
