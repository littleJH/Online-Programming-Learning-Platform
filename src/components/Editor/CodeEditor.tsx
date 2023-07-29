import Editor from '@monaco-editor/react'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from '@/components/Loading/Loading'
import { Modal, Select } from 'antd'
import { languageList } from './LanguageList'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import CodeEditorConfig from '@/components/Editor/CodeEditorConfig'
import { IMonacoConfig, IPersonalizeConfig, User } from '@/vite-env'
import { useRecoilState, useRecoilValue } from 'recoil'
import { monacoConfigState, userInfoState } from '@/Recoil/store'

interface Iprops {
  value: string
  className?: string
  height: number
  codeChange: Function
  setCodeLanguage?: Function
}

const CodeEditor: React.FC<Iprops> = (props: Iprops) => {
  const { height, value, className, codeChange, setCodeLanguage } = props
  const [openConfigModal, setopenConfigModal] = useState(false)
  const [info, setInfo] = useRecoilState(userInfoState)
  const [monacoConfig, setmonacoConfig] = useState(defaultConfig)
  const monacoRecoil = useRecoilValue(monacoConfigState)

  // useEffect(() => {
  //   getCurrentUserinfo().then(res => {
  //     const user: User = res.data.data.user
  //     if (user) {
  //       let config: IPersonalizeConfig
  //       config = user.res_long !== '' ? JSON.parse(user.res_long) : null
  //       config ? setmonacoConfig(config.monacoConfig) : null
  //     }
  //   })
  // }, [])

  useEffect(() => {
    console.log(monacoRecoil)
    setmonacoConfig(monacoRecoil)
  }, [])

  const handleConfigModalClose = useCallback(async () => {
    const personalizeConfig =
      info.res_long !== '' ? JSON.parse(info.res_long) : {}
    console.log('oldInfo', info)
    const newInfo: User = {
      ...info,
      res_long: JSON.stringify({
        ...personalizeConfig,
        monacoConfig
      })
    }
    console.log('newInfo', newInfo)
    const data = newInfo
    updateInfoApi(JSON.stringify(data)).then(async res => {
      console.log(res.data)
      if (res.data.code === 200) {
        const res = await getCurrentUserinfo()
        console.log(res.data)
        setInfo(res.data.data.user)
      }
    })
  }, [monacoConfig, info])
  return (
    <>
      <div
        style={{
          height: `${height}px`
        }}
      >
        <div className={'bg-slate-50 h-12 p-2 flex items-center'}>
          <Select
            bordered={false}
            defaultValue={monacoConfig.language}
            options={languageList}
            onSelect={value =>
              setCodeLanguage ? setCodeLanguage(value) : null
            }
          ></Select>
          <div className="grow"></div>
          <div
            onClick={() => setopenConfigModal(true)}
            className="hover:cursor-pointer"
          >
            <svg className="icon">
              <use href="#icon-setting"></use>
            </svg>
          </div>
        </div>
        <Editor
          defaultValue={value}
          height={`${height - 42}px`}
          width="100%"
          className={`${className} bg-white`}
          language={monacoConfig.language}
          theme={monacoConfig.theme}
          loading={<Loading></Loading>}
          onChange={value => codeChange(value)}
          options={monacoConfig.options}
        />
      </div>
      <Modal
        title={<p>代码编辑器配置</p>}
        open={openConfigModal}
        onCancel={() => setopenConfigModal(false)}
        afterClose={handleConfigModalClose}
        footer={[]}
        centered
      >
        <CodeEditorConfig
          monacoConfig={monacoConfig}
          setMonacoConfig={setmonacoConfig}
        ></CodeEditorConfig>
      </Modal>
    </>
  )
}

export default CodeEditor

const defaultConfig: IMonacoConfig = {
  language: 'cpp',
  theme: 'vs-dark',
  options: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 1,
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on',
    emptySelectionClipboard: true,
    mouseWheelScrollSensitivity: 1,
    mouseWheelZoom: true,
    padding: {
      bottom: 10,
      top: 10
    }
  }
}
