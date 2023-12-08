import dayjs from 'dayjs'

const GetTimeago = (time: string) => {
  let ago: {
    num: number
    unit: '秒' | '分钟' | '小时' | '天' | '月' | '年'
  }
  const previous = dayjs(time)
  const current = dayjs()
  const gap = current.unix() - previous.unix()
  if (gap <= 60) {
    ago = {
      num: gap + 1,
      unit: '秒',
    }
  } else if (gap > 60 && gap <= 60 * 60) {
    ago = {
      num: current.diff(previous, 'minute'),
      unit: '分钟',
    }
  } else if (gap > 60 * 60 && gap <= 60 * 60 * 24) {
    ago = {
      num: current.diff(previous, 'hour'),
      unit: '小时',
    }
  } else if (gap > 60 * 60 * 24 && gap <= 60 * 60 * 24 * 30) {
    ago = {
      num: current.diff(previous, 'day'),
      unit: '天',
    }
  } else if (gap > 60 * 60 * 24 * 30 && gap <= 60 * 60 * 24 * 365) {
    ago = {
      num: current.diff(previous, 'month'),
      unit: '月',
    }
  } else {
    ago = {
      num: current.diff(previous, 'year'),
      unit: '年',
    }
  }

  return ago
}

export default GetTimeago
