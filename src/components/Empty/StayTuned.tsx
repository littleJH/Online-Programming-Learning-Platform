import React from 'react'
import MySvgIcon from '../Icon/MySvgIcon'

const StayTuned: React.FC<{ size?: number }> = (props) => {
  const { size = 10 } = props
  return (
    <div className="w-full h-full flex justify-center items-center">
      <MySvgIcon href="#icon-jingqingqidai" size={size}></MySvgIcon>
    </div>
  )
}

export default StayTuned
