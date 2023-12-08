import { CompetitionState, ICountDown } from '@/type'
import React, { useState, useEffect } from 'react'
import { theme } from 'antd'
import dayjs from 'dayjs'

interface IProps {
  endTime: string
  onCountZero: Function
}

let interval: ReturnType<typeof setInterval>
const CountDown: React.FC<IProps> = props => {
  const { endTime, onCountZero: handleCountZero } = props
  const [countDown, setcountDown] = useState<ICountDown>()
  const { token } = theme.useToken()

  useEffect(() => {
    countDownFun()
    return () => {
      clearInterval(interval)
    }
  }, [])

  const countDownFun = () => {
    const end = dayjs(endTime)
    const time: ICountDown = {
      day: '00',
      hour: '00',
      min: '00',
      second: '00',
    }
    const fn = () => {
      const current = dayjs()
      let duration = end.unix() - current.unix()
      if (duration >= 0) {
        if (duration >= 60 * 60 * 24) {
          time.day =
            Math.floor(duration / (60 * 60 * 24)) >= 10
              ? String(Math.floor(duration / (60 * 60 * 24)))
              : `0${String(Math.floor(duration / (60 * 60 * 24)))}`
          duration = duration - 60 * 60 * 24 * Number(time.day)
        } else if (duration < 60 * 60 * 24 && duration > 60 * 60 * 23) {
          time.day = '00'
        }
        if (duration >= 60 * 60) {
          time.hour =
            Math.floor(duration / (60 * 60)) >= 10
              ? String(Math.floor(duration / (60 * 60)))
              : `0${String(Math.floor(duration / (60 * 60)))}`
          duration = duration - 60 * 60 * Number(time.hour)
        } else if (duration > 60 * 59 && duration < 60 * 60) {
          time.hour = '00'
        }
        if (duration >= 60) {
          time.min =
            Math.floor(duration / 60) >= 10
              ? String(Math.floor(duration / 60))
              : `0${String(Math.floor(duration / 60))}`
          duration = duration - 60 * Number(time.min)
        } else if (duration < 60) {
          time.min = '00'
        }
        time.second = duration >= 10 ? String(duration) : `0${String(duration)}`
      } else {
        handleCountZero()
        clearInterval(interval)
      }
      setcountDown({ ...time })
    }
    fn()
    interval = setInterval(() => {
      fn()
    }, 1000)
  }

  return (
    <div className="flex justify-center mt-4 h-12">
      {countDown?.day !== '00' && (
        <div className="countdown-section">
          <span className="countdown-amount">{countDown?.day}</span>
          <span
            className="countdown-period"
            style={{
              marginRight: '2rem',
            }}
          >
            天
          </span>
        </div>
      )}
      <div className="countdown-section">
        <span className="countdown-amount">{countDown?.hour}</span>
        <span className="countdown-period">:</span>
      </div>
      <div className="countdown-section">
        <span className="countdown-amount">{countDown?.min}</span>
        <span className="countdown-period">:</span>
      </div>
      <div className="countdown-section">
        <span className="countdown-amount">{countDown?.second}</span>
        {/* <span className="countdown-period">秒</span> */}
      </div>
    </div>
  )
}

export default CountDown
