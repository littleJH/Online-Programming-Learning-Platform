import React, { useEffect, useRef } from 'react'
import hljs from '@/tool/myUtils/highlight'

interface IProps {
  code: string
}

const Highlight: React.FC<IProps> = (props) => {
  const { code } = props
  const preRef = useRef(null)

  useEffect(() => {
    if (preRef.current) {
      hljs.highlightBlock(preRef.current)
    }
  }, [code, preRef])
  return (
    <pre>
      <code className="cpp code" ref={preRef}>
        {code}
      </code>
    </pre>
  )
}

export default Highlight
