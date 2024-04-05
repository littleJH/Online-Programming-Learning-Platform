import React, { useEffect, useRef, useState } from 'react'
import style from '../style.module.scss'
import { Button, Form, Input, InputRef, Modal, Result, ResultProps } from 'antd'
import TextEditor from '@/components/editor/TextEditor'
import { createNoticeBoardApi, getNoticeBoardApi } from '@/api/noticeboard'
import myHooks from '@/tool/myHooks/myHooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { getUserInfoApi } from '@/api/user'

const CreateNotice: React.FC = () => {
  const nav = myHooks.useNavTo()
  const [querys, setQuerys] = useSearchParams()
  const id = querys.get('id')
  const [form] = Form.useForm()
  const [content, setcontent] = useState<string>('')
  const [openResultModal, setOpenResultModal] = useState(false)
  const [result, setResult] = useState<ResultProps>()
  const titleInputRef = useRef<InputRef>(null)

  useEffect(() => {
    id && fetchNotice()
  }, [id])

  const fetchNotice = async () => {
    if (!id) return
    try {
      const notice = (await getNoticeBoardApi(id)).data.data.notice
      setcontent(notice.content)
      form.setFieldsValue({
        title: notice.title,
        content: notice.content,
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
          const res = (await createNoticeBoardApi(values)).data
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
                      onClick={() => nav(`/community/notice/${res.data.notice.id}`)}
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
    <div className={style.noticeCreation}>
      <Form
        form={form}
        name="noticeForm"
        layout="vertical"
        scrollToFirstError
        initialValues={{
          auto_update: true,
          auto_pass: false,
          pass_re: false,
        }}
      >
        <Form.Item name={'title'} label="标题：" rules={[{ required: true }]}>
          <Input ref={titleInputRef}></Input>
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

export default CreateNotice
