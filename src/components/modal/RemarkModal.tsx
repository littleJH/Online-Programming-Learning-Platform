import { Button, Modal } from 'antd'
import React from 'react'

const RemarkModal: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  content: React.ReactNode
  title?: string
}> = (props) => {
  const { open, setOpen, content, title } = props
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={[<Button type="primary">发布</Button>]}
      title={title}
      style={{
        top: '50%',
        translate: '0 -50%',
      }}
    >
      {content}
    </Modal>
  )
}

export default RemarkModal
