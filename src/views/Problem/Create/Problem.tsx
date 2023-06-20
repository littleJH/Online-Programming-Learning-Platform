import React from 'react'
import Text from '../../../components/Editor/Text'
import { Button, Form, Input, Select, Col, Row, InputNumber } from 'antd'
import { IProblem } from '@/vite-env'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { createProblemApi } from '@/api/problem'
import { Descendant } from 'slate'
import TextArea from 'antd/es/input/TextArea'
interface Iprops {
  form: any
  localProblemForm: IProblem
}

const Problem: React.FC<Iprops> = props => {
  const { Option } = Select
  const textChange = (value: any, name: string) => {
    props.form.setFieldValue(name, value)
  }

  return (
    <div>
      <Form
        className="bg-white p-8 rounded shadow w-full"
        {...formitemlayout}
        style={{ width: '' }}
        form={props.form}
        name="problemForm"
        size="large"
        scrollToFirstError
      >
        <Form.Item name={'title'} label="标题" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={'description'}
          label="题目描述"
          rules={[{ required: true }]}
        >
          <Text
            textChange={(value: any) => textChange(value, 'description')}
            initialValue={props.localProblemForm.description as Descendant[]}
          ></Text>
        </Form.Item>
        <Form.Item label="限制因素" name={'limit'} rules={[{ required: true }]}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name={'time_limit'}
                noStyle
                rules={[{ required: true }]}
              >
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
          <Text
            textChange={(value: any) => textChange(value, 'input')}
            initialValue={props.localProblemForm.input as Descendant[]}
          ></Text>
        </Form.Item>
        <Form.Item
          name={'output'}
          label="输出格式"
          rules={[{ required: true }]}
        >
          <Text
            textChange={(value: any) => textChange(value, 'output')}
            initialValue={props.localProblemForm.output as Descendant[]}
          ></Text>
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
              <Form.Item label=" " colon={false} style={{ width: '100%' }}>
                <Button
                  className="text-gray-500"
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
              <Form.Item label=" " colon={false}>
                <Button
                  className="text-gray-500"
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
          <Text
            textChange={(value: any) => textChange(value, 'hint')}
            initialValue={props.localProblemForm.hint as Descendant[]}
          ></Text>
        </Form.Item>
        <Form.Item name={'source'} label="来源">
          <Text
            textChange={(value: any) => textChange(value, 'source')}
            initialValue={props.localProblemForm.source as Descendant[]}
          ></Text>
        </Form.Item>
      </Form>
      <div className="h-8"></div>
    </div>
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
