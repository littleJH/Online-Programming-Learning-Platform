import { Button, ColorPicker, Divider, Form, notification, theme } from 'antd'
import React, { useCallback, useState } from 'react'
import CodeEditorConfig from '@/components/Editor/CodeEditorConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  monacoOptionsState,
  notificationApi,
  themeState,
  userInfoState,
} from '@/store/appStore'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import { Color } from 'antd/es/color-picker'
import { themeDefault } from '@/config/config'

const Setting: React.FC = () => {
  const [form] = Form.useForm()
  const [monacoOptions, setMonacoOptions] = useRecoilState(monacoOptionsState)
  const [info, setInfo] = useRecoilState(userInfoState)
  const [theme, setTheme] = useRecoilState(themeState)
  const notification = useRecoilValue(notificationApi)

  const handleClick = () => {
    updateConfig()
  }

  const updateConfig = () => {
    const newTheme = { ...theme, ...form.getFieldsValue(true) }
    console.log(newTheme)
    const newInfo = {
      ...info,
      theme: JSON.stringify(newTheme),
      manaco: JSON.stringify(monacoOptions),
    }
    updateInfoApi(JSON.stringify(newInfo)).then(async res => {
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

  return (
    <div style={{ width: '100%' }}>
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
      <Divider></Divider>
      <Form form={form}>
        <Form.Item name={'colorPrimary'} label="主题色">
          <ColorPicker
            defaultValue={theme['colorPrimary']}
            showText={true}
            format="hex"
            onChangeComplete={value => handleColorChange(value, 'colorPrimary')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorSuccess'} label="成功色">
          <ColorPicker
            defaultValue={theme['colorSuccess']}
            showText={true}
            format="hex"
            onChangeComplete={value => handleColorChange(value, 'colorSuccess')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorWarning'} label="警告色">
          <ColorPicker
            defaultValue={theme['colorWarning']}
            showText={true}
            format="hex"
            onChangeComplete={value => handleColorChange(value, 'colorWarning')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorError'} label="错误色">
          <ColorPicker
            defaultValue={theme['colorError']}
            showText={true}
            format="hex"
            onChangeComplete={value => handleColorChange(value, 'colorError')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item name={'colorInfo'} label="信息色">
          <ColorPicker
            defaultValue={theme['colorInfo']}
            showText={true}
            format="hex"
            onChangeComplete={value => handleColorChange(value, 'colorInfo')}
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
      <h3 className="label">代码编辑器设置</h3>
      <Divider></Divider>
      <CodeEditorConfig
        monacoOptions={monacoOptions}
        setMonacoOptions={setMonacoOptions}
      ></CodeEditorConfig>
      <div className="text-end">
        <Button type="primary" onClick={handleClick}>
          保存
        </Button>
      </div>
    </div>
  )
}

export default Setting
