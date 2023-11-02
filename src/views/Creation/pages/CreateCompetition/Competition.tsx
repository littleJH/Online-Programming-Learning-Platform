import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Switch, notification } from 'antd'
import TextEditor from '@/components/editor/TextEditor'
import dayjs from 'dayjs'
import { createCompetitionApi } from '@/api/competition'

const competitionType = [
  {
    label: '单人赛',
    value: 'Single'
  },
  {
    label: '组队赛',
    value: 'Group'
  },
  {
    label: '匹配赛',
    value: 'Match'
  },
  {
    label: 'OI赛',
    value: 'OI'
  }
]

const obj = localStorage.getItem('createCompetition') ? JSON.parse(localStorage.getItem('createCompetition') as string) : null

const Competition: React.FC = () => {
  const [form] = Form.useForm()
  const [isHack, setisHack] = useState(false)
  const [isGroup, setisGroup] = useState(false)
  const [timeRange, settimeRange] = useState(obj ? [dayjs(obj.timeRange[0]), dayjs(obj.timeRange[1])] : [dayjs(), dayjs()])

  const { RangePicker } = DatePicker
  useLayoutEffect(() => {
    const newObj = { ...obj }
    Object.keys(newObj ? newObj : {}).forEach((key, index) => {
      if (key == 'timeRange') {
        newObj[key] = [dayjs(newObj[key][0]), dayjs(newObj[key][1])]
      }
    })
    form.setFieldsValue(newObj)
  }, [])

  const textChange = (value: any, name: string) => {
    form.setFieldValue(name, value)
  }

  const timeRangeChange = (value: any, dateString: any) => {
    form.setFieldValue('timeRange', [dayjs(dateString[0]), dayjs(dateString[1])])
  }
  const onFinish = () => {
    form.validateFields().then(() => {
      const values = form.getFieldsValue()
      localStorage.setItem('createCompetition', JSON.stringify(values))
      Object.keys(values).forEach((key, index) => {
        switch (key) {
          case 'timeRange':
            Object.assign(values, {
              start_time: dayjs(values[key][0]).format('YYYY-MM-DD HH:mm:ss'),
              end_time: dayjs(values[key][1]).format('YYYY-MM-DD HH:mm:ss')
            })
            delete values.timeRange
            break
          case 'content':
            values[key] = JSON.stringify(values[key])
            break
          case 'hack_time':
            values[key] = dayjs(values.end_time).add(values[key], 'minute').format('YYYY-MM-DD HH:mm:ss')
            break
          default:
            break
        }
      })
      console.log(values)
      createCompetitionApi(JSON.stringify(values)).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          localStorage.setItem('competitionInfo', JSON.stringify(res.data.data.competition))
          notification.success({
            message: res.data.msg
          })
        } else {
          notification.warning({
            message: res.data.msg
          })
        }
      })
    })
  }
  return (
    <Form
      scrollToFirstError
      name='problemForm'
      form={form}
      onFinish={onFinish}
      layout='vertical'
    >
      <Form.Item
        name={'title'}
        label='标题'
        required
        rules={[{ required: true }]}
      >
        <Input></Input>
      </Form.Item>
      <Form.Item
        name={'type'}
        label='比赛类型'
        required
        rules={[{ required: true }]}
      >
        <Radio.Group
          optionType='button'
          options={competitionType}
          onChange={(e) => {
            if (e.target.value === 'Group') setisGroup(true)
            else setisGroup(false)
          }}
        ></Radio.Group>
      </Form.Item>
      {isGroup && (
        <Form.Item noStyle>
          <Row gutter={16}>
            <Col>
              <Form.Item
                name={'less_num'}
                label='人数下限'
                rules={[{ required: true }]}
              >
                <InputNumber min={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'up_num'}
                label='人数上限'
                dependencies={['less_num']}
                rules={[{ required: true }]}
              >
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}

      <Form.Item
        name={'timeRange'}
        label='比赛时间'
        rules={[{ required: true }]}
      >
        <RangePicker
          defaultValue={timeRange as any}
          showTime={{ format: 'HH:mm' }}
          format='YYYY-MM-DD HH:mm'
          onChange={timeRangeChange}
        ></RangePicker>
      </Form.Item>
      <Form.Item
        name={'content'}
        label='描述'
        required
        rules={[{ required: true }]}
      >
        <TextEditor
          mode='markdown'
          defaultHtml={obj ? obj.content : ''}
          htmlChange={(value: any) => textChange(value, 'content')}
        ></TextEditor>
      </Form.Item>
      <Form.Item label='Hack'>
        <Switch onChange={(value) => setisHack(value)}></Switch>
      </Form.Item>
      {isHack && (
        <Form.Item noStyle>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name={'hack_time'}
                label='Hack时长'
                rules={[{ required: true }]}
              >
                <InputNumber addonAfter={'min'}></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'hack_score'}
                label='Hack分数'
                tooltip={<span>黑客成功后的奖励分数</span>}
                rules={[{ required: true }]}
              >
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'hack_num'}
                label='Hack次数'
                tooltip={<span>最多可以获得分数的黑客次数</span>}
                rules={[{ required: true }]}
              >
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}
      <Button
        htmlType='submit'
        type='primary'
      >
        保存
      </Button>
    </Form>
  )
}

export default Competition
