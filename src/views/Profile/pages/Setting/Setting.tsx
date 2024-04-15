import { Button, ColorPicker, Divider, Form, Input, Switch, notification, theme } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import CodeEditorConfig from '@/components/Editor/CodeEditorConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { monacoOptionsState, notificationApi, themeState, userInfoState } from '@/store/appStore'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import { Color } from 'antd/es/color-picker'
import { themeDefault } from '@/config/config'
import { deleteMessageAiApi, getMessageAiApi, setMessageAiApi, updateMessageAiApi } from '@/api/message'

const Setting: React.FC = () => {
  const [form] = Form.useForm()
  const [messageForm] = Form.useForm()
  const [monacoOptions, setMonacoOptions] = useRecoilState(monacoOptionsState)
  const [info, setInfo] = useRecoilState(userInfoState)
  const [theme, setTheme] = useRecoilState(themeState)
  const [isDisable, setIsDisable] = useState(true)
  const notification = useRecoilValue(notificationApi)

  useEffect(() => {
    fetchMessageSetting()
  }, [])

  const fetchMessageSetting = async () => {
    try {
      const res = await getMessageAiApi()
      if (res.data.code === 200) {
        messageForm.setFieldsValue(res.data.data.ai)
        setIsDisable(false)
      }
    } catch {}
  }

  const updateConfig = () => {
    const newTheme = { ...theme, ...form.getFieldsValue(true) }
    console.log(newTheme)
    const newInfo = {
      ...info,
      theme: JSON.stringify(newTheme),
      manaco: JSON.stringify(monacoOptions),
    }
    updateInfoApi(JSON.stringify(newInfo)).then(async (res) => {
      if (res.data.code === 200) {
        const res = await getCurrentUserinfo()
        setInfo(res.data.data.user)
        notification &&
          notification.success({
            message: '保存成功',
          })
      }
    })
  }

  const handleColorChange = (value: Color, key: string) => {
    form.setFieldValue(key, `#${value.toHex()}`)
    setTheme(form.getFieldsValue(true))
  }

  const handleResetClick = async () => {
    setTheme(themeDefault)
    form.resetFields()
  }

  const submitMessageSetting = async () => {
    if (isDisable) {
      await deleteMessageAiApi()
      messageForm.resetFields()
    } else {
      const values = messageForm.getFieldsValue(['characters', 'prologue', 'reply'])
      const res = messageForm.getFieldValue('user_id')
        ? await updateMessageAiApi(values)
        : await setMessageAiApi(values)
      if (res.data.code === 200) {
        notification &&
          notification.success({
            message: '保存成功',
          })
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="flex justify-between items-center">
        <h3 className="label flex items-center">
          主题设置
          <Button
            size="small"
            style={{ fontSize: '0.75rem', marginLeft: '1rem' }}
            type="dashed"
            onClick={handleResetClick}
          >
            重置
          </Button>
        </h3>
        <Button type="primary" size="small" onClick={updateConfig}>
          保存
        </Button>
      </div>

      <Divider></Divider>
      <Form form={form}>
        <Form.Item name={'colorPrimary'} label="主题色">
          <ColorPicker
            defaultValue={theme['colorPrimary']}
            showText={true}
            format="hex"
            onChangeComplete={(value) => handleColorChange(value, 'colorPrimary')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorSuccess'} label="成功色">
          <ColorPicker
            defaultValue={theme['colorSuccess']}
            showText={true}
            format="hex"
            onChangeComplete={(value) => handleColorChange(value, 'colorSuccess')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorWarning'} label="警告色">
          <ColorPicker
            defaultValue={theme['colorWarning']}
            showText={true}
            format="hex"
            onChangeComplete={(value) => handleColorChange(value, 'colorWarning')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorError'} label="错误色">
          <ColorPicker
            defaultValue={theme['colorError']}
            showText={true}
            format="hex"
            onChangeComplete={(value) => handleColorChange(value, 'colorError')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorInfo'} label="信息色">
          <ColorPicker
            defaultValue={theme['colorInfo']}
            showText={true}
            format="hex"
            onChangeComplete={(value) => handleColorChange(value, 'colorInfo')}
          ></ColorPicker>
        </Form.Item>
        {/* <Form.Item
          name={'colorTextBase'}
          label='文字色'
        >
          <ColorPicker
            defaultValue={theme['colorTextBase']}
            showText={true}
            onChangeComplete={(value) => handleColorChange(value, 'colorTextBase')}
          ></ColorPicker>
        </Form.Item> */}
      </Form>
      <div className="flex justify-between items-center">
        <h3 className="label">留言板设置</h3>
        <Button type="primary" size="small" onClick={submitMessageSetting}>
          保存
        </Button>
      </div>
      <Form
        layout="vertical"
        labelCol={{
          span: 8,
        }}
        form={messageForm}
        style={{
          width: '50%',
        }}
      >
        <Form.Item name={'isAi'} label="是否开启AI回复">
          <Switch checked={!isDisable} onChange={(value) => setIsDisable(!value)}></Switch>
        </Form.Item>
        <Form.Item name="characters" label="人设" shouldUpdate>
          <Input placeholder="请输入人设" disabled={isDisable}></Input>
        </Form.Item>
        <Form.Item name="prologue" label="开场白">
          <Input placeholder="请输入开场白" disabled={isDisable}></Input>
        </Form.Item>
        <Form.Item name="reply" label="是否回复自己">
          <Switch disabled={isDisable}></Switch>
        </Form.Item>
      </Form>
      <Divider></Divider>
      <div className="flex justify-between items-center">
        <h3 className="label">代码编辑器设置</h3>
        <Button type="primary" size="small" onClick={updateConfig}>
          保存
        </Button>
      </div>
      <Divider></Divider>
      <CodeEditorConfig monacoOptions={monacoOptions} setMonacoOptions={setMonacoOptions}></CodeEditorConfig>
    </div>
  )
}

export default Setting
