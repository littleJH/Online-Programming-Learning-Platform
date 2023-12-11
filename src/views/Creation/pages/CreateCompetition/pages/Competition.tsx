import React, { useEffect, useLayoutEffect, useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Space,
  Switch,
} from 'antd'
import TextEditor from '@/components/editor/TextEditor'
import dayjs from 'dayjs'
import {
  createCompetitionApi,
  showCompetitionApi,
  updateCompetitionApi,
} from '@/api/competition'
import { useParams, useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'
import useNavTo from '@/tool/myHooks/useNavTo'
import { ICompetition } from '@/type'

const competitionType = [
  {
    label: '单人赛',
    value: 'Single',
  },
  {
    label: '组队赛',
    value: 'Group',
  },
  {
    label: '匹配赛',
    value: 'Match',
  },
  {
    label: 'OI赛',
    value: 'OI',
  },
]

const Competition: React.FC = () => {
  const navTo = useNavTo()
  const [querys] = useSearchParams()
  const competition_id = querys.get('competition_id')
  const [competition, setCompetition] = useState<ICompetition>()
  const [form] = Form.useForm()
  const [isHack, setisHack] = useState(false)
  const [isGroup, setisGroup] = useState(false)
  const { RangePicker } = DatePicker
  const notification = useRecoilValue(notificationApi)

  useEffect(() => {
    competition_id && init()
  }, [])

  const init = async () => {
    if (!competition_id) return
    const res = await showCompetitionApi(competition_id)
    const competition = res.data.data.competition
    setCompetition(competition)
    let values = {
      title: competition.title,
      type: competition.type,
      content: competition.content,
      less_num: competition.less_num,
      up_num: competition.up_num,
      Hack: competition.hack_score > 0 ? true : false,

      timeRange: [dayjs(competition.start_time), dayjs(competition.end_time)],
    }
    if (competition.hack_score > 0)
      values = {
        ...values,
        ...{
          hack_time: competition.hack_time,
          hack_score: competition.hack_score,
          hack_num: competition.hack_num,
        },
      }
    form.setFieldsValue(values)
  }

  const textChange = (value: any, name: string) => {
    form.setFieldValue(name, value)
  }

  const timeRangeChange = (value: any, dateString: any) => {
    form.setFieldValue('timeRange', [
      dayjs(dateString[0]),
      dayjs(dateString[1]),
    ])
  }
  const onFinish = () => {
    form.validateFields().then(async res => {
      const values = form.getFieldsValue()
      Object.keys(values).forEach((key, index) => {
        switch (key) {
          case 'timeRange':
            Object.assign(values, {
              start_time: dayjs(values[key][0]).format('YYYY-MM-DD HH:mm:ss'),
              end_time: dayjs(values[key][1]).format('YYYY-MM-DD HH:mm:ss'),
            })
            delete values.timeRange
            break
          case 'hack_time':
            values[key] = dayjs(values.end_time)
              .add(values[key], 'minute')
              .format('YYYY-MM-DD HH:mm:ss')
            break
          default:
            break
        }
      })
      console.log(values)
      let id = competition_id
      let res1
      if (competition_id) {
        res1 = await updateCompetitionApi(
          competition_id,
          JSON.stringify(values),
        )
        showNotification(res1.data)
      } else {
        res1 = await createCompetitionApi(JSON.stringify(values))
        id = res1.data.data.competition.id
        showNotification(res1.data)
      }
      res1.data.code === 200 &&
        navTo(`/creation/competition/problem${`?competition_id=${id}`}`)
    })
  }

  const showNotification = (data: any) => {
    if (data.code === 200) {
      notification &&
        notification.success({
          message: data.msg,
        })
    } else {
      notification &&
        notification.warning({
          message: data.msg,
        })
    }
  }
  return (
    <Form
      scrollToFirstError
      name="problemForm"
      form={form}
      onFinish={onFinish}
      layout="vertical">
      <Form.Item
        name={'title'}
        label="标题"
        required
        rules={[{ required: true }]}>
        <Input></Input>
      </Form.Item>
      <Form.Item
        name={'type'}
        label="比赛类型"
        required
        rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={competitionType}
          onChange={e => {
            if (e.target.value === 'Group') setisGroup(true)
            else setisGroup(false)
          }}></Radio.Group>
      </Form.Item>
      {isGroup && (
        <Form.Item noStyle>
          <Row gutter={16}>
            <Col>
              <Form.Item
                name={'less_num'}
                label="人数下限"
                rules={[{ required: true }]}>
                <InputNumber min={1}></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'up_num'}
                label="人数上限"
                dependencies={['less_num']}
                rules={[{ required: true }]}>
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}

      <Form.Item
        name={'timeRange'}
        label="比赛时间"
        rules={[{ required: true }]}>
        <RangePicker
          // defaultValue={timeRangeDefault}
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={timeRangeChange}></RangePicker>
      </Form.Item>
      <Form.Item
        name={'content'}
        label="描述"
        required
        rules={[{ required: true }]}>
        <TextEditor
          // defaultHtml={competition ? competition.content : ''}
          mode="markdown"
          htmlChange={(value: any) =>
            textChange(value, 'content')
          }></TextEditor>
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
                rules={[{ required: true }]}>
                <InputNumber addonAfter={'min'}></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'hack_score'}
                label="Hack分数"
                tooltip={<span>黑客成功后的奖励分数</span>}
                rules={[{ required: true }]}>
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={'hack_num'}
                label="Hack次数"
                tooltip={<span>最多可以获得分数的黑客次数</span>}
                rules={[{ required: true }]}>
                <InputNumber></InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      )}
      <Space className="flex justify-center">
        <Button
          onClick={() =>
            navTo(
              `/creation/competition/declare?competition_id=${competition_id}`,
            )
          }>
          上一步
        </Button>
        <Button htmlType="submit" type="primary">
          保存，下一步
        </Button>
      </Space>
    </Form>
  )
}

export default Competition
