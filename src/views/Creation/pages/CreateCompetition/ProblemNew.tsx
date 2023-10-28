import { Button, Form, Modal, Result, Steps, notification } from 'antd'
import React, { Fragment, useLayoutEffect } from 'react'
import { Descendant } from 'slate'
import { ProgramMode } from '@/type'
import { IProblem } from '@/type'
import { createProgramApi } from '@/api/program'
import { createProblemNewApi } from '@/api/problemNew'
import Problem from '@/views/Creation/pages/CreateProblem/Problem'
import Program from '@/views/Creation/pages/CreateProblem/Program'
import Submit from '@/views/Creation/pages/CreateProblem/submit'

interface IProps {
  open: boolean
  setisModelOpen: Function
}

const stringArrItem = [
  'test_input',
  'test_output',
  'sample_input',
  'sample_output'
]

const initial: Descendant = {
  type: 'paragraph',
  children: [
    {
      text: ''
    }
  ]
}

const initLocalProblemForm: any = {
  title: '',
  description: '',
  time_limit: '',
  time_unit: '',
  memory_limit: '',
  memory_unit: '',
  input: '',
  output: '',
  sample_case: { input: '', output: '' },
  test_case: { input: '', output: '' },
  hint: '',
  source: ''
}

type StepStatus = 'wait' | 'process' | 'finish' | 'error'

const ProblemNew: React.FC<IProps> = props => {
  const [form] = Form.useForm()
  const { open, setisModelOpen } = props
  const [stepStatus, setstepStatus] = React.useState<StepStatus>('process')
  const [currentStep, setcurrentStep] = React.useState(0)
  const [programMode, setprogramMode] = React.useState<ProgramMode>('standard')
  const [problemForm, setlocalProblemForm] =
    React.useState<IProblem>(initLocalProblemForm)
  const [failMessage, setfailMessage] = React.useState()
  const [codeLanguage, setcodeLanguage] = React.useState('cpp')
  const [code1, setcode1] = React.useState('')
  const [code2, setcode2] = React.useState('')

  useLayoutEffect(() => {
    if (currentStep === 0) {
      const data = localStorage.getItem('problemForm')
        ? (JSON.parse(
            localStorage.getItem('problemForm') as string
          ) as IProblem)
        : initLocalProblemForm
      setlocalProblemForm(data)
      form.setFieldsValue(data)
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

  const nextStep = () => {
    switch (currentStep) {
      case 0:
        form
          .validateFields()
          .then(res => {
            localStorage.setItem(
              'problemForm',
              JSON.stringify(form.getFieldsValue())
            )
            setcurrentStep(currentStep => currentStep + 1)
          })
          .catch(() => {
            notification.warning({
              message: '请完善表单',
              placement: 'topRight'
            })
          })
        break
      case 1:
        const data1 = JSON.stringify({
          language: 'C++',
          code: code1
        })
        const data2 = JSON.stringify({
          language: 'C++',
          code: code2
        })
        if (programMode === 'standard' || programMode === 'special_judge') {
          createProgramApi(data1).then(res => {
            console.log(res)
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
          Promise.all([createProgramApi(data1), createProgramApi(data2)]).then(
            res => {
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
            }
          )
        }
        break
      case 2:
        const result = Object.assign(
          {
            competition_id: ''
          },
          form.getFieldsValue(true)
        )
        Object.keys(result).forEach((key: string) => {
          if (typeof result[key] !== 'string') {
            result[key] = JSON.stringify(result[key])
          }
          if (stringArrItem.includes(key)) {
            result[key] = result[key].split(' ')
          }
          if (['memory_limit', 'time_limit'].includes(key)) {
            result[key] = Number(result[key])
          }
        })
        console.log(result)
        createProblemNewApi(JSON.stringify(result)).then(res => {
          console.log(res)
          if (res.data.code === 200) {
            localStorage.removeItem('problemForm')
            localStorage.removeItem('code1')
            localStorage.removeItem('code2')
            setstepStatus('finish')
          } else {
            setfailMessage(res.data.msg)
            setstepStatus('error')
          }
        })
        break
      default:
        break
    }
  }

  const handleCancel = () => {
    setisModelOpen(false)
  }
  return (
    <div>
      <Modal
        className="min-w-max"
        title="创建赛内题目"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button type="primary">上一步</Button>,
          <Button type="primary">下一步</Button>
        ]}
      >
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
          {currentStep === 0 && <Problem form={form}></Problem>}
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
      </Modal>
    </div>
  )
}

export default ProblemNew
