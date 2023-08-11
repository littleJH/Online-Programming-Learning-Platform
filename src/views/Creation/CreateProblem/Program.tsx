import React, { Fragment, useEffect } from 'react'
import CodeEditor from '@/components/Editor/CodeEditor'
import { Radio, Space } from 'antd'
import { ProgramMode } from '@/vite-env'
interface Iprops {
  programMode: ProgramMode
  setprogramMode: Function
  setcode1: Function
  setcode2: Function
  codeLanguage: string
  setcodeLanguage: Function
}
import style from './style.module.scss'

const Program: React.FC<Iprops> = props => {
  const { setcode1, setcode2, programMode, setprogramMode, setcodeLanguage } =
    props

  useEffect(() => {
    const code1 = localStorage.getItem('code1')
    const code2 = localStorage.getItem('code2')
    setcode1(code1 ? code1 : '')
    setcode2(code2 ? code2 : '')
  }, [])

  return (
    <Space direction="vertical" className="w-full">
      <div>
        <p className={style.label}>类型</p>
        <Radio.Group
          defaultValue={'standard'}
          optionType="button"
          onChange={e => {
            setprogramMode(e.target.value)
          }}
          options={[
            {
              label: <div>标准程序</div>,
              value: 'standard'
            },
            {
              label: <div>特判程序</div>,
              value: 'special_judge'
            },
            {
              label: <div>标准Hack程序</div>,
              value: 'standardHack'
            },
            {
              label: <div>特判Hack程序</div>,
              value: 'specialHack'
            }
          ]}
        ></Radio.Group>
      </div>

      {/* <div>
        <p className={style.label}>语言</p>
        <Radio.Group
          optionType="button"
          onChange={value =>  setcodeLanguage(value)}
          options={languageList}
        ></Radio.Group>
      </div> */}
      <p className={style.label}>程序</p>

      <Fragment>
        {(programMode === 'specialHack' || programMode === 'standardHack') && (
          <div className="flex items-center my-2">
            <div className="serial">1</div>
            <div>&nbsp;创建标准程序</div>
          </div>
        )}
        <CodeEditor
          oj=""
          value={
            localStorage.getItem('code1')
              ? (localStorage.getItem('code1') as string)
              : ''
          }
          codeChange={(value: any) => {
            setcode1(value)
            localStorage.setItem('code1', value)
          }}
          height={512}
          setCodeLanguage={setcodeLanguage}
        ></CodeEditor>
      </Fragment>

      {(programMode === 'specialHack' || programMode === 'standardHack') && (
        <Fragment>
          <div className="flex items-center my-2">
            <div className="serial">2</div>
            <div>&nbsp;创建输入检测程序</div>
          </div>
          <CodeEditor
            oj=""
            value={
              localStorage.getItem('code2')
                ? (localStorage.getItem('code2') as string)
                : ''
            }
            codeChange={(value: any) => {
              setcode2(value)
              localStorage.setItem('code2', value)
            }}
            height={512}
            setCodeLanguage={setcodeLanguage}
          ></CodeEditor>
        </Fragment>
      )}
      <div className="h-8"></div>
    </Space>
  )
}

export default Program
