import MySvgIcon from '@/components/Icon/MySvgIcon'
import { CompetitionType } from '@/type'
import React, { Fragment, useEffect, useState } from 'react'
import { theme } from 'antd'

const CompetitionTypeLabel: React.FC<{
  type: CompetitionType
  size: number
  showLabel?: boolean
}> = (props) => {
  const { size, showLabel } = props
  const [show, setshow] = useState<boolean>()
  const { token } = theme.useToken()

  useEffect(() => {
    showLabel === false ? setshow(false) : setshow(true)
  }, [showLabel])
  return (
    <div className='flex items-center'>
      {props.type === 'Single' && (
        <>
          <MySvgIcon
            href='#icon-wode'
            size={size}
            color={token.colorPrimaryTextHover}
          ></MySvgIcon>
          {show && <span style={{ padding: '0 0.5rem' }}>个人赛</span>}
        </>
      )}
      {props.type === 'Group' && (
        <>
          <MySvgIcon
            href='#icon-xiaozu'
            size={size}
            color={token.colorPrimaryTextHover}
          ></MySvgIcon>
          {show && <span style={{ padding: '0 0.5rem' }}>小组赛</span>}
        </>
      )}
      {props.type === 'Match' && (
        <>
          <MySvgIcon
            href='#icon-pipei'
            size={size}
            color={token.colorPrimaryTextHover}
          ></MySvgIcon>
          {show && <span style={{ padding: '0 0.5rem' }}>匹配赛</span>}
        </>
      )}
      {props.type === 'OI' && (
        <>
          <MySvgIcon
            href='#icon-pipei'
            size={size}
            color={token.colorPrimaryTextHover}
          ></MySvgIcon>
          {show && <span style={{ padding: '0 0.5rem' }}>OI赛</span>}
        </>
      )}
    </div>
  )
}

export default CompetitionTypeLabel
