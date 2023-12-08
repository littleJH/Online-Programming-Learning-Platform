import { color } from 'd3'
import React from 'react'

const MySvgIcon: React.FC<{
  href: string
  color?: string
  classname?: string
  size?: number
}> = props => {
  const { href, size = 1, classname = '', color } = props
  return (
    <svg
      className={`icon-base ${classname}`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        color: color,
      }}
    >
      <use href={`${href.includes('#icon-') ? '' : '#icon-'}${href}`}></use>
    </svg>
  )
}

export default MySvgIcon
