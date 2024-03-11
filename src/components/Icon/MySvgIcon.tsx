import React from 'react'

const MySvgIcon: React.FC<{
  href: string
  color?: string
  classname?: string
  size?: number | string
  onClick?: any
}> = (props) => {
  const { href, size = 1, classname = '', color, onClick } = props
  return (
    <svg
      onClick={onClick}
      className={`icon-base ${classname}`}
      style={{
        width: typeof size === 'number' ? `${size}rem` : size,
        height: typeof size === 'number' ? `${size}rem` : size,
        color: color,
      }}
    >
      <use href={`${href.includes('#icon-') ? '' : '#icon-'}${href}`}></use>
    </svg>
  )
}

export default MySvgIcon
