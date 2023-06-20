import React, { Fragment } from 'react'
import Code from '../../../components/Editor/Code'
import { languageList } from '@/components/Editor/LanguageList'
import { Segmented, Timeline, Button, Radio } from 'antd'
import { ProgramMode } from '@/vite-env'
interface Iprops {
  codeLanguage: string
  setcodeLanguage: Function
  programMode: ProgramMode
  setprogramMode: Function
  setcode1: Function
  setcode2: Function
}

const Program: React.FC<Iprops> = props => {
  const [codeTheme, setcodeTheme] = React.useState('light')
  return (
    <div>
      <div className="rounded flex items-center my-2">
        <Radio.Group
          defaultValue={'standard'}
          optionType="button"
          onChange={e => {
            props.setprogramMode(e.target.value)
          }}
          size="large"
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
              label: <div>标准hack</div>,
              value: 'standardHack'
            },
            {
              label: <div>特判hack</div>,
              value: 'specialHack'
            }
          ]}
        ></Radio.Group>

        <div className="ml-4 flex-grow">
          <Segmented
            block={true}
            onChange={value => props.setcodeLanguage(value)}
            size="large"
            options={languageList}
          ></Segmented>
        </div>
      </div>
      <Fragment>
        {(props.programMode === 'specialHack' ||
          props.programMode === 'standardHack') && (
          <div className="flex items-center my-2">
            <div className="serial">1</div>
            <div>&nbsp;创建标准程序</div>
          </div>
        )}
        <Code
          value={
            localStorage.getItem('code1')
              ? (localStorage.getItem('code1') as string)
              : ''
          }
          codeChange={(value: any) => {
            props.setcode1(value)
            localStorage.setItem('code1', value)
          }}
          className="p-2 shadow rounded"
          height="50vh"
          width="800px"
          theme={codeTheme}
          language={props.codeLanguage}
        ></Code>
      </Fragment>

      {(props.programMode === 'specialHack' ||
        props.programMode === 'standardHack') && (
        <Fragment>
          <div className="flex items-center my-2">
            <div className="serial">2</div>
            <div>&nbsp;创建输入检测程序</div>
          </div>
          <Code
            value={
              localStorage.getItem('code2')
                ? (localStorage.getItem('code2') as string)
                : ''
            }
            codeChange={(value: any) => {
              props.setcode2(value)
              localStorage.setItem('code2', value)
            }}
            className="p-2 shadow rounded"
            height="50vh"
            width="800px"
            theme={codeTheme}
            language={'java'}
          ></Code>
        </Fragment>
      )}
      <div className="h-8"></div>
    </div>
  )
}

export default Program
