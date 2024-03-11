import { Button, Empty, Space } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import React from 'react'

const MyEmpty: React.FC<{ onMkdir: () => void; onUpload: () => void }> = (props) => {
  const { onMkdir, onUpload } = props
  return (
    <Empty
      image={
        <svg>
          <use href="#icon-nodata"></use>
        </svg>
      }
      imageStyle={{
        height: '20rem',
        margin: '2rem 0',
      }}
      description=""
    >
      <Space>
        <Button icon={<UploadOutlined />} onClick={onUpload}>
          上传文件
        </Button>
        <Button icon={<PlusOutlined />} onClick={onMkdir}>
          新建文件夹
        </Button>
      </Space>
    </Empty>
  )
}

export default MyEmpty
