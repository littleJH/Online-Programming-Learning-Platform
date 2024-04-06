import React from 'react'
import MySvgIcon from '../Icon/MySvgIcon'

const NoData: React.FC<{ text: React.ReactNode; showIcon?: boolean }> = (props) => {
  const { showIcon = true } = props
  return (
    <div className="h-24 flex justify-center items-center">
      {showIcon && <MySvgIcon href="#icon-nodata" classname="icon-large mr-4"></MySvgIcon>}
      <div className="text-slate-500">{props.text}</div>
    </div>
  )
}

export default NoData
