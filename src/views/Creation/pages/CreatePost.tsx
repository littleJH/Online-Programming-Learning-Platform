import React, { useEffect, useMemo, useState } from 'react'
import style from '../style.module.scss'
import { Button, Drawer, Form, Input, InputRef, Modal, Result, ResultProps } from 'antd'
import TextEditor from '@/components/editor/TextEditor'
import myHooks from '@/tool/myHooks/myHooks'
import { useParams, useSearchParams } from 'react-router-dom'
import ProblemList from '@/components/Problem/list/List'
import { IPrblemTableDataType } from '@/type'
import { showProblemApi } from '@/api/problem'
import { createPostApi } from '@/api/post'

const CreatePost: React.FC = () => {
  const nav = myHooks.useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const problem_id = querys.get('problem_id')
  const [form] = Form.useForm()
  const [content, setcontent] = useState<string>('')
  const [openResultModal, setOpenResultModal] = useState(false)
  const [result, setResult] = useState<ResultProps>()
  const [selectedProblems, setSelectedProblems] = useState<IPrblemTableDataType[]>([])
  const [openDrawer, setOpenDrawer] = useState(false)

  const selectedRowKeys = useMemo(() => [...selectedProblems.map((value) => value.key)], [selectedProblems])

  useEffect(() => {
    if (problem_id) fetchProblem()
  }, [])

  useEffect(() => {
    form.setFieldsValue({
      problem: selectedProblems[0]?.title,
      id: selectedProblems[0]?.key,
    })
  }, [selectedProblems])

  const fetchProblem = async () => {
    if (!problem_id) return
    try {
      const problem = (await showProblemApi(problem_id)).data.data.problem
      form.setFieldsValue({
        title: problem.title,
        id: problem.id,
      })
    } catch {}
  }

  const handleContentChange = (value: string) => {
    setcontent(value)
    form.setFieldValue('content', value === '<p><br></p>' || value === '' ? undefined : value)
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const res = (
            await createPostApi(values.id, {
              title: values.title,
              content: values.content,
            })
          ).data
          setResult({
            status: res.code === 200 ? 'success' : 'error',
            title: `创建${res.code === 200 ? '成功' : '失败'}`,
            subTitle: res.code === 200 ? '' : res.msg,
            extra:
              res.code === 200
                ? [
                    <Button
                      type="primary"
                      key={'detail'}
                      onClick={() =>
                        problem_id
                          ? nav(`/problemdetail/${problem_id}/post`)
                          : nav(`/community/post/${res.data.post.id}`)
                      }
                    >
                      查看详情
                    </Button>,
                    <Button
                      type="primary"
                      key={'next'}
                      onClick={() => {
                        setQuerys([])
                        form.resetFields()
                        setOpenResultModal(false)
                        setcontent('')
                      }}
                    >
                      继续创建
                    </Button>,
                  ]
                : null,
          })
          setOpenResultModal(true)
        } catch {}
      })
      .catch((err) => {})
  }

  return (
    <div className={style.postCreation}>
      <Drawer width={'50vw'} open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <ProblemList
          mode="radio"
          selectedProblems={selectedProblems}
          setSelectedProblems={setSelectedProblems}
          selectedRowKeys={selectedRowKeys}
        ></ProblemList>
      </Drawer>
      <Form
        form={form}
        name="postForm"
        layout="vertical"
        scrollToFirstError
        initialValues={{
          auto_update: true,
          auto_pass: false,
          pass_re: false,
        }}
      >
        <Form.Item name={'problem'} label="题目" rules={[{ required: true }]}>
          <Input
            disabled
            suffix={
              problem_id ? null : (
                <Button type="primary" onClick={() => setOpenDrawer(true)}>
                  选择题目
                </Button>
              )
            }
          ></Input>
        </Form.Item>
        <Form.Item name={'id'} label="题目 ID" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item name={'title'} label="题解标题" rules={[{ required: true }]}>
          <Input></Input>
        </Form.Item>
        <Form.Item name={'content'} label="描述" rules={[{ required: true }]}>
          <TextEditor value={content} mode="markdown" htmlChange={handleContentChange}></TextEditor>
        </Form.Item>
      </Form>
      <div className="text-center">
        <Button
          type="primary"
          style={{
            margin: '1rem 0',
          }}
          onClick={handleSubmit}
        >
          发布
        </Button>
      </div>
      <Modal
        open={openResultModal}
        footer={null}
        onCancel={() => setOpenResultModal(false)}
        style={{
          translate: '0 50%',
        }}
      >
        <Result {...result}></Result>
      </Modal>
    </div>
  )
}

export default CreatePost
