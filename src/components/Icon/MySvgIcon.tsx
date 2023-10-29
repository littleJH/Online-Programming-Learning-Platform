import React from 'react'

const MySvgIcon: React.FC<{
  href: string
  classname?: string
  size?: number
}> = props => {
  const { href, size = 1, classname = '' } = props
  return (
    <svg
      className={`icon-base ${classname}`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`
      }}
    >
      <use href={`#icon-${href}`}></use>
    </svg>
  )
}

export default MySvgIcon
