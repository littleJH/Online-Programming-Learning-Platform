/**
 * @format
 * @Author: littleJH
 * @Date: 2023-10-30 16:02:56
 * @Last Modified by:   littleJH
 * @Last Modified time: 2023-10-30 16:02:56
 */

/** @format */

import { themeState } from '@/store/appStore'
import React from 'react'
import { useRecoilValue } from 'recoil'

const UploadItem: React.FC<{
  name?: string
  status?: string
  originNode?: React.ReactNode
  message?: string
}> = (props) => {
  const { originNode, name, status, message } = props
  const theme = useRecoilValue(themeState)
  const messageColor = status === 'error' ? theme.colorError : status === 'done' ? theme.colorSuccess : ''

  return (
    <div>
      {originNode ? (
        <div className="flex justify-between items-end">
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
