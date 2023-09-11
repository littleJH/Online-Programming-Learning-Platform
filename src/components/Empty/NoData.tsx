import React from 'react'

const NoData: React.FC<{ text: React.ReactNode }> = props => {
  return (
    <div className="h-24 flex justify-center items-center">
      <svg className="icon-large mr-4">
        <use href="#icon-nodata"></use>
      </svg>
      <div className="text-slate-500">{props.text}</div>
    </div>
  )
}

export default NoData
