import React, { useCallback, useEffect, useRef, useState } from 'react'
import Problem from './Problem'
import {
  Button,
  Form,
  Modal,
  notification,
  Result,
  Space,
  Steps,
  UploadFile
} from 'antd'
import Program from './Program'
import { createProgramApi } from '@/api/program'
import {
  createProblemApi,
  createProblemLabelApi,
  getProblemLabelsApi,
  getProblemListApi,
  showProblemApi,
  uploadProblemByFileApi,
  uploadVjudgeProblemApi
} from '@/api/problem'
import { IProblem, ProgramMode } from '@/vite-env'
import { useRecoilState } from 'recoil'
import { currentProblemState } from '@/recoil/store'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Dragger from 'antd/es/upload/Dragger'
import { createTagApi, createTagAutoApi } from '@/api/tag'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { UploadProblemModal } from '@/components/Problem/UploadProblem/UploadProblemModal'

const stringArrItem = [
  'test_input',
  'test_output',
  'sample_input',
  'sample_output'
]

const Create: React.FC = () => {
  const [querys, setQuerys] = useSearchParams()
  const id = useRef(querys.get('id'))
  const [problem, setProblem] = useState<IProblem>()
  const [stepStatus, setstepStatus] = useState<
    'wait' | 'process' | 'finish' | 'error'
  >('process')
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [codeLanguage, setcodeLanguage] = useState('C')
  const [code1, setcode1] = useState('')
  const [code2, setcode2] = useState('')
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const [openCreateTagModal, setOpenCreateTagModal] = useState(false)
  const [programMode, setprogramMode] = useState<ProgramMode>('standard')
  const [currentStep, setcurrentStep] = useState(0)
  const [failMessage, setfailMessage] = useState()
  const [loading, setloading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [currentProblem, setCurrentProblem] =
    useRecoilState(currentProblemState)

  useEffect(() => {
    if (id.current) {
      showProblemApi(id.current).then(res => {
        const problem = res.data.data.problem
        setProblem(problem)
      })
    }
  }, [])

  useEffect(() => {
    console.log(currentStep, stepStatus)
  }, [currentStep, stepStatus])

  const nextStep0 = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        localStorage.setItem(
          'problemForm',
          JSON.stringify(form.getFieldsValue())
        )
        setcurrentStep(currentStep => currentStep + 1)
      })
      .catch(() => {
        notification.warning({
          message: '请完善表单！',
          placement: 'topRight'
        })
      })
  }, [form])

  const nextStep1 = useCallback(async () => {
    const data1 = JSON.stringify({
      language: 'C++11',
      code: code1
    })
    const data2 = JSON.stringify({
      language: 'java',
      code: code2
    })

    if (programMode === 'standard' || programMode === 'special_judge') {
      console.log(data1)
      const res = await createProgramApi(data1)
      console.log(res.data)
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
    } else {
      const res = await Promise.all([
        createProgramApi(data1),
        createProgramApi(data2)
      ])
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
    }
    submit()
  }, [code1, code2, programMode, form, codeLanguage])

  const submit = useCallback(() => {
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
    createProblemApi(JSON.stringify(result)).then(res => {
      console.log(res.data)
      setcurrentStep(currentStep => currentStep + 1)
      if (res.data.code === 200) {
        // localStorage.removeItem('problemForm')
        // localStorage.removeItem('code1')
        // localStorage.removeItem('code2')
        setstepStatus('finish')
        setCurrentProblem(res.data.data.problem)
      } else {
        setfailMessage(res.data.msg)
        setstepStatus('error')
      }
    })
  }, [form])

  const handleNextClick = () => {
    switch (currentStep) {
      case 0:
        nextStep0()
        break
      case 1:
        nextStep1()
        break
      case 2:
        nav(`/problem/${currentProblem?.id}`)
        break
      default:
        break
    }
  }

  const createTagAuto = useCallback(() => {
    let index = 0
    getProblemListApi(1, 10)
      .then(res => {
        console.log(res.data.data)
        return res.data.data.total
      })
      .then(async total => {
        while (index <= total + 1) {
          console.log(index, total + 1)
          const res = await getProblemListApi(index, 1)
          const problems = res.data.data.problems
          console.log('problemList  ===', problems)
          for (let problem of problems) {
            const res = await getProblemLabelsApi(problem.id)
            console.log('labels  ===', res.data.data.problemLabels)
            if (res.data.data.problemLabels.length <= 2) {
              const text: string = problem.description.replace(/<[^<>]+>/g, '')
              const res1 = await createTagAutoApi(text.slice(0, 50))
              const tags = res1.data.data.tagCount
              console.log('tags  ===', tags)
              let index1 = 0
              for (let tag of tags) {
                if (index1 >= 2) break
                const res2 = await createProblemLabelApi(problem.id, tag.Tag)
                console.log(tags, tag, res2.data)
              }
            }
          }
          index++
        }
      })
      .catch(err => console.log(err))
  }, [])



  return (
    <div className="flex">
      <div className="px-8 my-4  overflow-y-scroll" style={{ width: '768px' }}>
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
        {currentStep === 2 && (
          <>
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
                  <Button key={'1'} type="primary" onClick={handleNextClick}>
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
          </>
        )}
        {/* {currentStep === 2 && stepStatus === 'process' && (
          <Submit form={form}></Submit>
        )} */}
        {stepStatus === 'process' && (
          <div className="text-end">
            {currentStep === 0 && (
              <Button type="primary" onClick={() => handleNextClick()}>
                下一步
              </Button>
            )}
            {currentStep === 1 && (
              <Space>
                <Button
                  onClick={() => {
                    setcurrentStep(currentStep => currentStep - 1)
                  }}
                >
                  上一步
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleNextClick()}
                  loading={loading}
                >
                  下一步
                </Button>
              </Space>
            )}
          </div>
        )}
      </div>
      <div className="w-16"></div>
      <div>
        <Steps
          className="w-24 h-48 mt-8 sticky top-8"
          direction="vertical"
          progressDot
          status={stepStatus}
          current={currentStep}
          items={[
            { title: '题目', description: '' },
            { title: '程序', description: '' },
            { title: '结果', description: '' }
          ]}
        ></Steps>
        {/* <Button type="dashed" onClick={() => setOpenUploadModal(true)}>
          上传题目
        </Button> */}
        <div
          className="fixed bottom-4"
          style={{
            width: '128px',
            height: '128px'
          }}
        >
          <Space direction="vertical">
            <Button type="dashed" onClick={() => setOpenUploadModal(true)}>
              上传题目文件
            </Button>
            <Button type="dashed" onClick={() => setOpenCreateTagModal(true)}>
              自动创建标签
            </Button>
          </Space>
        </div>
      </div>

      <UploadProblemModal openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal}></UploadProblemModal>

      <Modal
        title="自动创建标签"
        open={openCreateTagModal}
        footer={[]}
        onCancel={() => setOpenCreateTagModal(false)}
        style={{
          translate: '0 50%'
        }}
      >
        <Button onClick={createTagAuto}>自动创建标签</Button>
      </Modal>
    </div>
  )
}

export default Create
