import { useEffect, useRef, useState } from 'react'

const useCountdown = (initCount = 10, callback: any) => {
  const [count, setcount] = useState<number>(initCount)
  const counter = useRef(null)

  useEffect(() => {
    if (count <= 0) {
      clearInterval(counter.current as any)
      setTimeout(() => {
        callback()
      }, 1000)
    }
  }, [count])

  const start = () => {
    setcount(initCount)
    const interval = setInterval(() => {
      setcount(count => count - 1)
    }, 1000)
    counter.current = interval as any
  }

  useEffect(() => {
    return () => {
      clearInterval(counter.current as any)
    }
  }, [])

  return {
    count,
    start
  }
}

export default useCountdown
