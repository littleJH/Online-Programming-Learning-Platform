import Editor from '@monaco-editor/react'
import React, { useCallback, useEffect, useState } from 'react'
import Loading from '@/components/Loading/Loading'
import { Modal, Select } from 'antd'
import { languageList, poj_languageList } from './LanguageList'
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
  setCodeLanguage: Function
  oj: string
}

const cpp = ['C', 'C++', 'C++11', 'C++14', 'C++17', 'C++20']

const CodeEditor: React.FC<Iprops> = (props: Iprops) => {
  const { height, value, className, codeChange, setCodeLanguage, oj } = props
  const [languageOptions, setLanguageOptions] = useState(languageList)
  const [openConfigModal, setopenConfigModal] = useState(false)
  const [info, setInfo] = useRecoilState(userInfoState)
  const monacoRecoil = useRecoilValue(monacoConfigState)
  const [monacoConfig, setmonacoConfig] = useState(defaultConfig)

  useEffect(() => {
    setmonacoConfig(monacoRecoil)
    setLanguageOptions(() => {
      switch (oj) {
        case 'POJ':
          return poj_languageList
        default:
          return languageList
      }
    })
  }, [])

  const handleLanguageChange = useCallback(
    (value: any) => {
      console.log(value)
      setCodeLanguage(value)
      setmonacoConfig({
        ...monacoConfig,
        language: value
      })
      updateConfig(value)
    },
    [monacoConfig]
  )

  const updateConfig = useCallback(
    (language?: string) => {
      const personalizeConfig =
        info.res_long !== '' ? JSON.parse(info.res_long) : {}
      const newInfo: User = {
        ...info,
        res_long: JSON.stringify({
          ...personalizeConfig,
          monacoConfig: {
            language: language ? language : monacoConfig.language,
            theme: monacoConfig.theme,
            options: monacoConfig.options
          }
        })
      }
      updateInfoApi(JSON.stringify(newInfo)).then(async res => {
        console.log(res.data)
        if (res.data.code === 200) {
          const res = await getCurrentUserinfo()
          console.log(res.data)
          setInfo(res.data.data.user)
        }
      })
    },
    [monacoConfig, info]
  )
  return (
    <>
      <div
        style={{
          height: `${height}px`
        }}
      >
        <div className={'bg-slate-50 h-12 p-2 flex items-center'}>
          <Select
            style={{
              width: '160px'
            }}
            bordered={false}
            defaultValue={monacoRecoil.language}
            options={languageOptions}
            onChange={handleLanguageChange}
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
          language={
            cpp.includes(monacoConfig.language) ? 'cpp' : monacoConfig.language
          }
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
        afterClose={updateConfig}
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
  language: 'C',
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
