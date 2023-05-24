import React, { Fragment, lazy, Suspense, useLayoutEffect } from 'react'
import Problem from './Problem'
import { Button, Form, notification, Result, Steps } from 'antd'
import Program from './Program'
import Submit from './submit'
import { createProgramApi } from '@/api/program'
import { createProblemApi } from '@/api/problem'
import { Descendant } from 'slate'
import { ProgramMode, IProblem } from '@/vite-env'

const initial: Descendant = {
  type: 'paragraph',
  children: [
    {
      text: ''
    }
  ]
}

const initLocalProblemForm: IProblem = {
  title: '',
  description: [initial],
  time_limit: '',
  time_unit: '',
  memory_limit: '',
  memory_unit: '',
  input: [initial],
  output: [initial],
  sample_case: { input: '', output: '' },
  test_case: { input: '', output: '' },
  hint: [initial],
  source: [initial]
}

const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
}

const stringArrItem = [
  'test_input',
  'test_output',
  'sample_input',
  'sample_output'
]

const problemForm = localStorage.getItem('localProblemForm')
  ? (JSON.parse(localStorage.getItem('localProblemForm') as string) as IProblem)
  : initLocalProblemForm

const Create: React.FC = () => {
  const [stepStatus, setstepStatus] = React.useState<
    'wait' | 'process' | 'finish' | 'error'
  >('process')
  const [form] = Form.useForm()
  const [codeLanguage, setcodeLanguage] = React.useState('cpp')
  const [code1, setcode1] = React.useState('')
  const [code2, setcode2] = React.useState('')
  const [programMode, setprogramMode] = React.useState<ProgramMode>('standard')
  const [currentStep, setcurrentStep] = React.useState(0)
  const [localProblemForm, setlocalProblemForm] =
    React.useState<IProblem>(problemForm)
  const [failMessage, setfailMessage] = React.useState()
  const [loading, setloading] = React.useState(false)

  useLayoutEffect(() => {
    if (currentStep === 0) {
      form.setFieldsValue(localProblemForm)
    } else if (currentStep === 1) {
      setcode1(
        localStorage.getItem('code1')
          ? (localStorage.getItem('code1') as string)
          : ''
      )
      setcode2(
        localStorage.getItem('code2')
          ? (localStorage.getItem('code2') as string)
          : ''
      )
    }
  }, [currentStep])

  const nextStep = async () => {
    if (currentStep === 0) {
      form
        .validateFields()
        .then(res => {
          localStorage.setItem(
            'localProblemForm',
            JSON.stringify(form.getFieldsValue())
          )
          setcurrentStep(currentStep => currentStep + 1)
        })
        .catch(err => {
          notification.warning({
            message: '请完善表单！',
            placement: 'topRight'
          })
        })
    } else if (currentStep === 1) {
      // setloading(true)
      const data1 = JSON.stringify({
        language: 'C++',
        code: code1
      })
      const data2 = JSON.stringify({
        language: 'java',
        code: code2
      })

      if (programMode === 'standard' || programMode === 'special_judge') {
        createProgramApi(data1, config).then(res => {
          if (res.data.code !== 200) {
            notification.warning({
              message: res.data.msg,
              placement: 'topRight'
            })
            return
          }
          const id = res.data.data.program.id
          programMode === 'standard'
            ? form.setFieldValue('standard', id)
            : form.setFieldValue('special_judge', id)
          setcurrentStep(currentStep => currentStep + 1)
        })
      } else {
        Promise.all([
          createProgramApi(data1, config),
          createProgramApi(data2, config)
        ]).then(res => {
          if (res[0].data.code !== 200) {
            notification.warning({
              message: res[0].data.msg,
              placement: 'topRight'
            })
            return
          }
          const id1 = res[0].data.data.program.id
          const id2 = res[1].data.data.program.id
          programMode === 'standardHack'
            ? form.setFieldValue('standard', id1)
            : form.setFieldValue('special_judge', id1)
          form.setFieldValue('input_check', id2)
          setcurrentStep(currentStep => currentStep + 1)
          // setloading(false)
        })
      }
    } else if (currentStep === 2) {
      const result = Object.assign({}, form.getFieldsValue(true))
      Object.keys(result).forEach((key: string) => {
        if (key === 'sample_case') {
          if (result.sample_case_expand) {
            result.sample_case = [
              result.sample_case,
              ...(result.sample_case_expand as any)
            ]
          } else {
            result.sample_case = [result.sample_case]
          }
        }

        if (key === 'test_case') {
          if (result.test_case_expand) {
            result.test_case = [
              result.test_case,
              ...(result.test_case_expand as any)
            ]
          } else {
            result.test_case = [result.test_case]
          }
        }

        if (
          typeof result[key] !== 'string' &&
          key !== 'sample_case' &&
          key !== 'test_case'
        ) {
          result[key] = JSON.stringify(result[key])
        }

        if (stringArrItem.includes(key)) {
          result[key] = result[key].split(' ')
        }

        if (['memory_limit', 'time_limit'].includes(key)) {
          result[key] = Number(result[key])
        }

        delete result.sample_case_expand
        delete result.test_case_expand
      })
      console.log(result)
      createProblemApi(JSON.stringify(result), config).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          // localStorage.removeItem('localProblemForm')
          // localStorage.removeItem('code1')
          // localStorage.removeItem('code2')
          setstepStatus('finish')
        } else {
          setfailMessage(res.data.msg)
          setstepStatus('error')
        }
      })
    }
  }

  return (
    <div className="w-full h-full overflow-scroll flex justify-center ">
      <div style={{ width: '1000px' }} className="flex flex-col items-center">
        <div className="p-8 w-2/3">
          <Steps
            status={stepStatus}
            current={currentStep}
            items={[
              { title: '创建题目', description: '' },
              { title: '创建程序', description: '' },
              { title: '提交', description: '' }
            ]}
          ></Steps>
        </div>
        {currentStep === 0 && (
          <Problem form={form} localProblemForm={localProblemForm}></Problem>
        )}
        {currentStep === 1 && (
          <Program
            codeLanguage={codeLanguage}
            setcode1={setcode1}
            setcode2={setcode2}
            programMode={programMode}
            setprogramMode={setprogramMode}
            setcodeLanguage={setcodeLanguage}
          ></Program>
        )}
        {currentStep === 2 && stepStatus === 'process' && (
          <Submit form={form}></Submit>
        )}
        {stepStatus === 'finish' && (
          <Result
            status={'success'}
            title="题目创建成功！"
            extra={[
              <Button
                key={'0'}
                type="primary"
                onClick={() => {
                  setcurrentStep(0)
                  setstepStatus('process')
                }}
              >
                继续创建下一题
              </Button>,
              <Button key={'1'} type="primary" onClick={() => {}}>
                查看题目详情
              </Button>
            ]}
          ></Result>
        )}
        {stepStatus === 'error' && (
          <Result
            status={'error'}
            title={failMessage}
            extra={[
              <Button
                key={'2'}
                onClick={() => {
                  setcurrentStep(1)
                  setstepStatus('process')
                }}
              >
                返回“创建程序"
              </Button>,
              <Button
                key={'1'}
                onClick={() => {
                  setcurrentStep(0)
                  setstepStatus('process')
                }}
              >
                返回“创建题目"
              </Button>
            ]}
          ></Result>
        )}
        {stepStatus === 'process' && (
          <div>
            {currentStep === 0 && (
              <Button size="large" type="primary" onClick={() => nextStep()}>
                下一步
              </Button>
            )}
            {currentStep === 1 && (
              <Fragment>
                <Button
                  size="large"
                  onClick={() => {
                    setcurrentStep(currentStep => currentStep - 1)
                  }}
                >
                  上一步
                </Button>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => nextStep()}
                  loading={loading}
                >
                  下一步
                </Button>
              </Fragment>
            )}
            {currentStep === 2 && (
              <Fragment>
                <Button
                  size="large"
                  onClick={() => {
                    setcurrentStep(currentStep => currentStep - 1)
                  }}
                >
                  上一步
                </Button>
                <Button size="large" type="primary" onClick={nextStep}>
                  提交
                </Button>
              </Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Create
