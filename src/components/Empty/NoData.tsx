import React from 'react'
import MySvgIcon from '../Icon/MySvgIcon'

const NoData: React.FC<{ text: React.ReactNode; iconSize?: number; showIcon?: boolean }> = (props) => {
  const { showIcon = true, iconSize } = props
  return (
    <div className="h-24 flex justify-center items-center">
      {showIcon && <MySvgIcon href="#icon-nodata" classname="icon-large mr-4" size={iconSize}></MySvgIcon>}
      <div className="text-slate-500">{props.text}</div>
    </div>
  )
}

export default NoData
