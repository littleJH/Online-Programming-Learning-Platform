import { Button, Form, FormInstance, Input, Switch } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import { createUserGroupApi } from '@/api/group'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'

interface IProps {
  form: FormInstance
  doneCallback: Function
}

const CreateGroupForm: React.FC<IProps> = (props) => {
  const { form, doneCallback } = props
  const notification = useRecoilValue(notificationApi)

  const createGroup = () => {
    form
      .validateFields()
      .then(() => {
        const data = form.getFieldsValue()
        createUserGroupApi(JSON.stringify(data)).then((res) => {
          console.log(res.data)
          if (res.data.code === 200) {
            doneCallback(res.data.data.group)
          } else {
            notification &&
              notification.warning({
                message: res.data.msg
              })
          }
        })
      })
      .catch((err) => {})
  }
  return (
    <div>
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          name={'title'}
          label='小组名'
          rules={[{ required: true }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name={'content'}
          label='小组描述'
          rules={[{ required: true }]}
        >
          <TextArea></TextArea>
        </Form.Item>
        <Form.Item
          name={'auto'}
          label='自动通过用户申请'
          rules={[{ required: true }]}
        >
          <Switch
            checked={form.getFieldValue('auto')}
            onChange={(value) => form.setFieldValue('auto', value)}
          ></Switch>
        </Form.Item>
        <Form.List name={'users'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...field}
                  label={
                    <div>
                      <MinusCircleOutlined
                        className='dynamic-delete-button'
                        onClick={() => remove(field.name)}
                      />
                      <span className='mx-2'>{`用户${index + 1}`}</span>
                    </div>
                  }
                  colon={false}
                  key={field.key}
                >
                  <Input placeholder='请填入用户 id'></Input>
                </Form.Item>
              ))}
              <Form.Item
                label=' '
                colon={false}
              >
                <Button
                  size='large'
                  className=''
                  type='dashed'
                  style={{ width: '100%' }}
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  添加用户
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      <div style={{ textAlign: 'end' }}>
        <Button
          type='primary'
          onClick={createGroup}
        >
          创建
        </Button>
      </div>
    </div>
  )
}

export default CreateGroupForm
