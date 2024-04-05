import React, { useEffect, useMemo, useState } from 'react'
import style from '../style.module.scss'
import { Button, Form, Input, InputRef, Modal, Result, ResultProps } from 'antd'
import TextEditor from '@/components/editor/TextEditor'
import myHooks from '@/tool/myHooks/myHooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { createCommentApi } from '@/api/comment'
import ProblemList from '@/components/Problem/list/List'
import { IPrblemTableDataType } from '@/type'

const CreateComment: React.FC = () => {
  const nav = myHooks.useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const id = querys.get('id')
  const [form] = Form.useForm()
  const [content, setcontent] = useState<string>('')
  const [openResultModal, setOpenResultModal] = useState(false)
  const [result, setResult] = useState<ResultProps>()
  const [selectedProblems, setSelectedProblems] = useState<IPrblemTableDataType[]>([])

  const selectedRowKeys = useMemo(() => [...selectedProblems.map((value) => value.key)], [selectedProblems])

  useEffect(() => {
    console.log('selectedProblems ==> ', selectedProblems)
    form.setFieldsValue({
      title: selectedProblems[0]?.title,
      id: selectedProblems[0]?.key,
    })
  }, [selectedProblems])

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
            await createCommentApi(values.id, {
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
                      onClick={() => nav(`/community/comment/${res.data.comment.id}`)}
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
    <div className={style.commentCreation}>
      <ProblemList
        mode="radio"
        selectedProblems={selectedProblems}
        setSelectedProblems={setSelectedProblems}
        selectedRowKeys={selectedRowKeys}
      ></ProblemList>
      <Form
        form={form}
        name="commentForm"
        layout="vertical"
        scrollToFirstError
        initialValues={{
          auto_update: true,
          auto_pass: false,
          pass_re: false,
        }}
      >
        <Form.Item name={'title'} label="题目" rules={[{ required: true }]}>
          <Input disabled></Input>
        </Form.Item>
        <Form.Item name={'id'} label="题目 ID" rules={[{ required: true }]}>
          <Input disabled></Input>
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

export default CreateComment
