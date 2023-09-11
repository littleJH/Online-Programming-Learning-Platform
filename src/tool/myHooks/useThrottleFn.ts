import React, { useState, useRef, useEffect } from 'react'

const useThrottleFn = <T, U extends any[]>(
  fn: (...args: U) => T,
  ms: number = 500,
  args: U
) => {
  const [state, setstate] = useState<T | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const nextArgs = useRef<U>()

  useEffect(() => {
    if (!timeout.current) {
      setstate(fn(...args))

      const timeoutCallback = () => {
        if (nextArgs.current) {
          setstate(fn(...nextArgs.current))
          nextArgs.current = undefined
          timeout.current = setTimeout(timeoutCallback, ms)
        } else {
          timeout.current = undefined
        }
      }
    } else {
      nextArgs.current = args
    }
  }, [args])

  useEffect(() => () => timeout.current && clearTimeout(timeout.current))

  return state
}

export default useThrottleFn
