import React, { useEffect, useRef } from 'react'
import { Button } from 'antd'
import ac_1 from '@/assets/medal/ac_1.svg'
import ac_2 from '@/assets/medal/ac_2.svg'
import ac_3 from '@/assets/medal/ac_3.svg'
import ac_4 from '@/assets/medal/ac_4.svg'
import CodeEditor from '@/components/Editor/CodeEditor'

export default function Homepage() {
  return (
    <>
      <CodeEditor value="111" height={400} codeChange={() => {}}></CodeEditor>
      <div className="h-full flex justify-center items-center">
        <img src={ac_1} width={128}></img>
        <img src={ac_2} width={128}></img>
        <img src={ac_3} width={128}></img>
        <img src={ac_4} width={128}></img>
      </div>
    </>
  )
}
