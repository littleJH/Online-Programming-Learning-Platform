import { IArticleLabel } from '@/vite-env'
import React from 'react'

const CommunityLabel: React.FC<{
  label: IArticleLabel
}> = props => {
  const { label } = props
  return (
    <span
      className="max-w-min max-h-min rounded bg-sky-100 text-sky-900 select-none hover:cursor-pointer hover:shadow transition-all"
      style={{
        padding: '0.2rem 0.5rem',
        fontSize: '8px'
      }}
    >
      {label.label}
    </span>
  )
}

export default CommunityLabel
