/*
 * @Author: littleJH 
 * @Date: 2023-10-30 16:12:02 
 * @Last Modified by:   littleJH 
 * @Last Modified time: 2023-10-30 16:12:02 
 */
import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import Dragger from 'antd/es/upload/Dragger'
import { createProblemLabelApi, uploadVjudgeProblemApi } from '@/api/problem'
import { RcFile, UploadFile } from 'antd/es/upload'
import { createTagAutoApi } from '@/api/tag'
import { IProblem } from '@/type'
import { formatProblemJson } from '@/tool/MyUtils/utils'
import UploadItem from './UploadItem'

interface IProps {
  openUploadModal: boolean
  setOpenUploadModal: Function
}

export const UploadProblemModal: React.FC<IProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { openUploadModal, setOpenUploadModal } = props

  const handleUpload = async (file: RcFile) => {
    const data = await formatProblemJson(file)
    const {
      data: { code, data: resData, msg }
    } = await uploadVjudgeProblemApi(JSON.stringify(data))
    if (code === 200) createTagAuto(resData.problem)
    setFileList((value) => [
      ...value,
      {
        uid: file.uid,
        name: file.name,
        status: code === 200 ? 'done' : 'error',
        originFileObj: file,
        message: msg || ''
      } as UploadFile
    ])

    return false
  }

  const createTagAuto = async (problem: IProblem) => {
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
  }

  const handleReUpload = () => {
    const list = [...fileList]
    setFileList([])
    for (let file of list) file.status === 'error' && file.originFileObj && handleUpload(file.originFileObj)
  }

  const handleRemove = (file: UploadFile) => {
    const index = fileList.findIndex((value) => value.uid === file.uid)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const handleDrop = () => {
    setFileList([])
  }

  const renderItem = (originNode: React.ReactNode, file: UploadFile) => {
    interface MyFile extends UploadFile {
      message: string
    }
    const myFile = { ...file } as MyFile
    return (
      <UploadItem
        originNode={originNode}
        message={myFile.message}
        status={file.status}
      ></UploadItem>
    )
  }

  const renderModalFooter = () => {
    let count = 0
    const footer = []
    fileList.forEach((file) => file.status === 'error' && count++)
    if (count)
      footer.push(
        <Button
          key={'btn1'}
          onClick={handleReUpload}
        >
          重新上传错误文件
        </Button>
      )
    return footer
  }

  return (
    <Modal
      title={'上传题目文件'}
      open={openUploadModal}
      onCancel={() => {
        setOpenUploadModal(false)
        setFileList([])
      }}
      footer={renderModalFooter}
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
          maxCount={100}
          showUploadList={{
            showDownloadIcon: false,
            showRemoveIcon: false,
            showPreviewIcon: false
          }}
          height={200}
          fileList={fileList}
          multiple={true}
          onRemove={handleRemove}
          beforeUpload={handleUpload}
          onDrop={handleDrop}
          itemRender={renderItem}
        >
          <div className='p-2'>
            点击或拖拽<br></br>批量上传外站题目.json文件
          </div>
        </Dragger>
      </div>
    </Modal>
  )
}
