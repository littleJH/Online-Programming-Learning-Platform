import React, { useEffect, useState } from 'react'
import { languageList } from '@/components/editor/LanguageList'

const LanaugeLabel: React.FC<{
  value: string
}> = (props) => {
  return (
    <div className="flex justify-center">{languageList.find((item: any) => item.value === props.value)?.label}</div>
  )
}

export default LanaugeLabel
