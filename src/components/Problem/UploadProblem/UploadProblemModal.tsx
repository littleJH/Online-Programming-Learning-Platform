import React, { useCallback, useState } from 'react'
import { Modal, Space } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import {
  createProblemLabelApi,
  getProblemLabelsApi,
  getProblemListApi,
  uploadProblemByFileApi,
  uploadVjudgeProblemApi
} from '@/api/problem'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { createTagAutoApi } from '@/api/tag'
import { IProblem } from '@/type'
import { formatProblemJson } from '@/tool/MyUtils/utils'

interface IProps {
  openUploadModal: boolean
  setOpenUploadModal: Function
}

export const UploadProblemModal: React.FC<IProps> = props => {
  const [failUploadFileList, setFailUploadFileList] = useState<UploadFile[]>([])
  const { openUploadModal, setOpenUploadModal } = props

  const handleUpload = async (file: RcFile) => {
    const data = await formatProblemJson(file)
    const {
      data: { code, data: resData }
    } = await uploadVjudgeProblemApi(JSON.stringify(data))
    console.log('code data ==> ', code, resData)
    if (code === 200) {
      createTagAuto(resData.problem)
    }
    setFailUploadFileList(value => [
      ...value,
      {
        uid: file.uid,
        name: file.name,
        status: code === 200 ? 'done' : 'error'
      } as UploadFile
    ])

    return false
  }

  const createTagAuto = useCallback(async (problem: IProblem) => {
    const { description, id } = problem
    const text: string = description.replace(/<[^<>]+>/g, '')
    const res = await createTagAutoApi(text.slice(0, 50))
    const {
      code,
      data: { tagCount }
    } = res.data
    if (code === 200) {
      let index1 = 0
      for (let tag of tagCount) {
        if (index1 > 2) break
        const res2 = await createProblemLabelApi(id, tag.Tag)
        console.log(tagCount, tag, res2.data)
      }
    }
  }, [])

  const handleRemove = (file: UploadFile) => {
    const index = failUploadFileList.findIndex(value => value.uid === file.uid)
    const newFileList = failUploadFileList.slice()
    newFileList.splice(index, 1)
    setFailUploadFileList(newFileList)
  }

  const handleDrop = () => {
    setFailUploadFileList([])
  }

  return (
    <Modal
      title={'上传题目文件'}
      open={openUploadModal}
      onCancel={() => {
        setOpenUploadModal(false)
        setFailUploadFileList([])
      }}
      footer={[]}
      maskClosable={false}
    >
      {/* <Dragger
          accept="text/xml"
          directory
          name="file"
          multiple={true}
          beforeUpload={file => {
            console.log(file)
            const form = new FormData()
            form.append('file', file)
            uploadProblemByFileApi(form).then(res => {
              console.log(res)
            })
          }}
        >
          <div className="p-2">
            点击或拖拽批量上传.xml文件(支持上传文件夹)
          </div>
        </Dragger> */}
      <div
        style={{
          maxHeight: '500px',
          overflow: 'scroll'
        }}
      >
        <Dragger
          height={200}
          fileList={failUploadFileList}
          multiple={true}
          onRemove={handleRemove}
          beforeUpload={handleUpload}
          onDrop={handleDrop}
        >
          <div className="p-2">
            点击或拖拽<br></br>批量上传外站题目.json文件
          </div>
        </Dragger>
      </div>
    </Modal>
  )
}
