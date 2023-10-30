/**
 * @format
 * @Author: littleJH
 * @Date: 2023-10-30 16:02:56
 * @Last Modified by:   littleJH
 * @Last Modified time: 2023-10-30 16:02:56
 */

/** @format */

import React from 'react'

const UploadItem: React.FC<{
  name?: string
  status?: string
  originNode?: React.ReactNode
  message?: string
}> = (props) => {
  const { originNode, name, status, message } = props
  const messageColor = status === 'error' ? '#ef4444' : status === 'done' ? '#10b981' : ''

  return (
    <div>
      {originNode ? (
        <div className='flex justify-between items-end'>
          <span>{originNode}</span>
          <span style={{ color: messageColor, fontSize: '0.75rem' }}>{message || ''}</span>
        </div>
      ) : (
        <>
          <span>{name || ''}</span>
          <span>{message || ''}</span>
          <span>{status || ''}</span>
        </>
      )}
    </div>
  )
}

export default UploadItem
