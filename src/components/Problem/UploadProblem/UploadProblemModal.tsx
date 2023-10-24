import React, { useCallback, useState } from "react";
import { Modal, Space } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { uploadProblemByFileApi, uploadVjudgeProblemApi } from "@/api/problem";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";

interface IProps {
  openUploadModal: boolean
  setOpenUploadModal: Function

}

export const UploadProblemModal:React.FC<IProps> = (props) => {
  const [failUploadFileList, setFailUploadFileList] = useState<UploadFile[]>([])
  const { openUploadModal, setOpenUploadModal } = props


  const handleUpload = useCallback(
    (file: UploadFile) => {
      setFailUploadFileList([])
      if (!file.originFileObj) return
      file.originFileObj.text().then(text => {
        const data = JSON.parse(text)
        // const index = data.time_limit.search(/[A-z]|[a-z]/)
        // data.time_unit = data.time_limit.slice(index).toLowerCase()
        // data.time_limit = Number(data.time_limit.slice(0, index))
        // const index1 = data.memory_limit.search(/[A-Z]|[a-z]/)
        // data.memory_unit = data.memory_limit.slice(index1).toLowerCase()
        // data.memory_unit.includes('b')
        //   ? null
        //   : (data.memory_unit = `${data.memory_unit}b`)
        // data.memory_limit = Number(data.memory_limit.slice(0, index1))
        // data.oj = 'POJ'
        data.problem_id = String(data.id)
        data.sample_case = [
          {
            input: data.sample_case.sample_input,
            output: data.sample_case.sample_outpit
          }
        ]
        delete data.id
        uploadVjudgeProblemApi(JSON.stringify(data))
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            console.log(err)
            file.status = 'error'
            setFailUploadFileList(value => [...value, file])
          })
      })
    },
    [failUploadFileList]
  )

  return (
    <Modal
    title={'上传题目文件'}
    open={openUploadModal}
    onCancel={() => setOpenUploadModal(false)}
    footer={
      [
        // <Button
        //   type="primary"
        //   disabled={fileList.length === 0}
        //   onClick={handleUpload}
        // >
        //   点击上传
        // </Button>
      ]
    }
    style={{
      translate: '0 50%'
    }}
  >
    <Space>
      <Dragger
        accept="text/xml"
        directory
        name="file"
        multiple={true}
        // action={'http://api_oj.mgaronya.com/problem/create/by/file'}
        // headers={{
        //   Authorization: localStorage.getItem('token') as string,
        //   'Content-Type': 'multipart/form-data'
        // }}
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
      </Dragger>
      <Dragger
        accept="application/json"
        name="file"
        multiple={true}
        // beforeUpload={(file, fileList) => {
        //   setFileList(fileList)
        //   return false
        // }}
        onRemove={file => {
          const index = failUploadFileList.findIndex(
            value => value.uid === file.uid
          )
          const newFileList = failUploadFileList.slice()
          newFileList.splice(index, 1)
          setFailUploadFileList(newFileList)
        }}
        onChange={(info: UploadChangeParam<UploadFile<RcFile>>) => {
          console.log(info.file.name)
          handleUpload(info.file)
        }}
        fileList={failUploadFileList}
      >
        <div className="p-2">
          点击批量上传外站题目.json文件(支持上传文件夹)
        </div>
      </Dragger>
    </Space>
  </Modal>
  )
}