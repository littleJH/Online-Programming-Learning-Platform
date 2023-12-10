import MySvgIcon from '@/components/Icon/MySvgIcon'
import React, {useEffect, useState} from 'react'
import {theme} from 'antd'

const CompetitionTypeLabel: React.FC<{
  type: string
  size: number
  showLabel?: boolean
}> = (props) => {
  const {size, showLabel, type} = props
  const [show, setshow] = useState<boolean>()
  const {token} = theme.useToken()

  useEffect(() => {
    showLabel === false ? setshow(false) : setshow(true)
  }, [showLabel])
  return (
    <div className='flex items-center'>
      {type === 'Single' && (
        <>
          <MySvgIcon
            href='#icon-wode'
            size={size}
            color={token.colorPrimaryTextHover}></MySvgIcon>
          {show && <span style={{padding: '0 0.5rem'}}>个人赛</span>}
        </>
      )}
      {type === 'Group' && (
        <>
          <MySvgIcon
            href='#icon-xiaozu'
            size={size}
            color={token.colorPrimaryTextHover}></MySvgIcon>
          {show && <span style={{padding: '0 0.5rem'}}>小组赛</span>}
        </>
      )}
      {type === 'Match' && (
        <>
          <MySvgIcon
            href='#icon-pipei'
            size={size}
            color={token.colorPrimaryTextHover}></MySvgIcon>
          {show && <span style={{padding: '0 0.5rem'}}>匹配赛</span>}
        </>
      )}
      {type === 'OI' && (
        <>
          <MySvgIcon
            href='#icon-pipei'
            size={size}
            color={token.colorPrimaryTextHover}></MySvgIcon>
          {show && <span style={{padding: '0 0.5rem'}}>OI赛</span>}
        </>
      )}
    </div>
  )
}

export default CompetitionTypeLabel
