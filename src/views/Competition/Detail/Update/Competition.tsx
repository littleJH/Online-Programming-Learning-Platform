import React, { useState, useEffect } from 'react'
import {
  Switch,
  Button,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  DatePicker
} from 'antd'
import { ICompetition } from '@/type'
import dayjs from 'dayjs'
import { updateCompetitionApi } from '@/api/competition'
import TextEditor from '@/components/editor/TextEditor'

interface Iprops {
  competition: ICompetition | undefined
  setcompetition: Function
}

const Competition: React.FC<Iprops> = props => {
  const { competition, setcompetition } = props
  const { RangePicker } = DatePicker
  const [form] = Form.useForm()
  const [isHack, setisHack] = useState(false)
  const [isGroup, setisGroup] = useState(false)

  const timeRange: any = [
    dayjs(competition?.start_time),
    dayjs(competition?.end_time)
  ]

  useEffect(() => {
    form.setFieldsValue(competition)
    form.setFieldValue('timeRange', timeRange)
    const duration =
      dayjs(competition?.hack_time).unix() - dayjs(competition?.end_time).unix()
    form.setFieldValue('hack_time', duration >= 0 ? duration : 0)
  }, [competition])

  const onFinish = () => {
    const data = { ...competition }
    const formObj = form.getFieldsValue()
    Object.keys(formObj).forEach(key => {
      if (key === 'timeRange') {
        data.start_time = dayjs(formObj[key][0]).format('YYYY-MM-DD HH:mm:ss')
        data.end_time = dayjs(formObj[key][1]).format('YYYY-MM-DD HH:mm:ss')
      } else if (key === 'hack_time') {
        data.hack_time = dayjs(data.end_time)
          .add(formObj[key], 'minute')
          .format('YYYY-MM-DD HH:mm:ss')
      } else {
        data[key] = formObj[key]
      }
    })
    delete data.id
    delete data.passwd_id
    delete data.type
    delete data.created_at
    delete data.updated_at
    delete data.user_id
    console.log(data)
    updateCompetitionApi(competition?.id as string, JSON.stringify(data)).then(
      res => {
        console.log(res)
        setcompetition(res.data.data.competition)
      }
    )
  }
  const textChange = (value: any, name: string) => {
    form.setFieldValue(name, JSON.stringify(value))
  }

  const timeRangeChange = (value: any, dateString: any) => {
    form.setFieldValue('timeRange', [
      dayjs(dateString[0]),
      dayjs(dateString[1])
    ])
  }

  return (
    <div className="">
      <Form
        size="large"
        scrollToFirstError
        name="problemForm"
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name={'title'}
          label="标题"
          required
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        {isGroup && (
          <Form.Item noStyle>
            <Row gutter={16}>
              <Col>
                <Form.Item
                  name={'less_num'}
                  label="人数下限"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1}></InputNumber>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={'up_num'}
                  label="人数上限"
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
          label="比赛时间"
          rules={[{ required: true }]}
        >
          <RangePicker
            defaultValue={timeRange}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={timeRangeChange}
          ></RangePicker>
        </Form.Item>
        <Form.Item
          name={'content'}
          label="描述"
          required
          rules={[{ required: true }]}
        >
          <TextEditor
            defaultHtml={competition?.content}
            htmlChange={(value: any) => textChange(value, 'content')}
          ></TextEditor>
        </Form.Item>
        <Form.Item label="Hack">
          <Switch onChange={value => setisHack(value)}></Switch>
        </Form.Item>
        {isHack && (
          <Form.Item noStyle>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={'hack_time'}
                  label="Hack时长"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} addonAfter={'min'}></InputNumber>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={'hack_score'}
                  label="Hack分数"
                  tooltip={<span>黑客成功后的奖励分数</span>}
                  rules={[{ required: true }]}
                >
                  <InputNumber></InputNumber>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={'hack_num'}
                  label="Hack次数"
                  tooltip={<span>最多可以获得分数的黑客次数</span>}
                  rules={[{ required: true }]}
                >
                  <InputNumber></InputNumber>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        )}
        <div className="w-full flex justify-center">
          <Button htmlType="submit" type="primary">
            保存
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Competition
