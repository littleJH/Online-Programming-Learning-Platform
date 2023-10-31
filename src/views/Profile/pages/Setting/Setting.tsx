import { Button, ColorPicker, Divider, Form, theme } from 'antd'
import React, { useCallback, useState } from 'react'
import CodeEditorConfig from '@/components/editor/CodeEditorConfig'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { monacoConfigState, themeState, userInfoState } from '@/store/appStore'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import { Color } from 'antd/es/color-picker'

const Setting: React.FC = () => {
  const [form] = Form.useForm()
  const monacoConfigRecoil = useRecoilValue(monacoConfigState)
  const [monacoConfig, setMonacoConfig] = useState(monacoConfigRecoil)
  const [info, setInfo] = useRecoilState(userInfoState)
  const [theme, setTheme] = useRecoilState(themeState)

  const handleClick = () => {
    updateConfig()
  }

  const updateConfig = (language?: string) => {
    console.log('form ==> ', form.getFieldsValue(true))
    const personalizeConfig = info && info.res_long !== '' ? JSON.parse(info.res_long) : {}
    const newMonaco = {
      language: language ? language : monacoConfig.language,
      theme: monacoConfig.theme,
      options: monacoConfig.options
    }
    const newTheme = { ...theme, ...form.getFieldsValue(true) }
    console.log(newTheme)
    const newInfo = {
      ...info,
      res_long: JSON.stringify({
        ...personalizeConfig,
        monacoConfig: newMonaco,
        theme: newTheme
      })
    }
    updateInfoApi(JSON.stringify(newInfo)).then(async (res) => {
      if (res.data.code === 200) {
        const res = await getCurrentUserinfo()
        setInfo(res.data.data.user)
      }
    })
  }

  const handleColorChange = (value: Color, key: string) => {
    // const newTheme = {...theme}
    // const personalizeConfig = info && info.res_long !== '' ? JSON.parse(info.res_long) : {}
    // const newInfo = {
    //   ...info,
    //   res_long: JSON.stringify({
    //     ...personalizeConfig,
    //     theme: personalizeConfig.
    //   })
    // }
    console.log(form.getFieldsValue(true))
    setTheme(form.getFieldsValue(true))
    const globalStyle = document.getElementsByTagName('body')[0].style
    globalStyle.setProperty(`--${key}`, `#${value.toHex()}`)
    form.setFieldValue(key, value.toHex())
  }

  return (
    <div style={{ width: '512px' }}>
      <h3 className='label flex items-center'>
        主题设置
        <Button
          size='small'
          style={{ fontSize: '0.5rem', marginLeft: '1rem' }}
        >
          重置
        </Button>
      </h3>
      <Divider></Divider>
      <Form form={form}>
        <Form.Item
          name={'colorPrimary'}
          label='主题色'
        >
          <ColorPicker
            defaultValue={theme['colorPrimary']}
            showText={true}
            format='hex'
            onChangeComplete={(value) => handleColorChange(value, 'colorPrimary')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item
          name={'colorSuccess'}
          label='成功色'
        >
          <ColorPicker
            defaultValue={theme['colorSuccess']}
            showText={true}
            format='hex'
            onChangeComplete={(value) => handleColorChange(value, 'colorSuccess')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item
          name={'colorWarning'}
          label='警告色'
        >
          <ColorPicker
            defaultValue={theme['colorWarning']}
            showText={true}
            format='hex'
            onChangeComplete={(value) => handleColorChange(value, 'colorWarning')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item
          name={'colorError'}
          label='错误色'
        >
          <ColorPicker
            defaultValue={theme['colorError']}
            showText={true}
            format='hex'
            onChangeComplete={(value) => handleColorChange(value, 'colorError')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item
          name={'colorInfo'}
          label='信息色'
        >
          <ColorPicker
            defaultValue={theme['colorInfo']}
            showText={true}
            format='hex'
            onChangeComplete={(value) => handleColorChange(value, 'colorInfo')}
          ></ColorPicker>
        </Form.Item>
        <Form.Item
          name={'colorTextBase'}
          label='文字色'
        >
          <ColorPicker
            defaultValue={theme['colorTextBase']}
            showText={true}
            onChangeComplete={(value) => handleColorChange(value, 'colorTextBase')}
          ></ColorPicker>
        </Form.Item>
      </Form>
      <h3 className='label'>代码编辑器设置</h3>
      <Divider></Divider>
      <CodeEditorConfig
        monacoConfig={monacoConfig}
        setMonacoConfig={setMonacoConfig}
      ></CodeEditorConfig>
      <div className='text-end'>
        <Button
          type='primary'
          onClick={handleClick}
        >
          保存
        </Button>
      </div>
    </div>
  )
}

export default Setting
