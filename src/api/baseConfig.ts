import { notification } from 'antd'
import axios from 'axios'

const baseUrlObj: any = {
  iconBaseUrl: 'http://icon.mgaronya.com',
  imgBaseUrl: 'http://api_img.mgaronya.com',
  baseURL: import.meta.env.DEV ? '/api' : 'http://api_oj.mgaronya.com',
  testBaseUrl: import.meta.env.DEV ? '/test' : 'http://test_oj.mgaronya.com/test',
  tagBaseUrl: import.meta.env.DEV ? '/tag_api' : 'http://api_tag.mgaronya.com',
  wsBaseUrl: 'ws://api_oj.mgaronya.com',
  translateBaseUrl: import.meta.env.DEV ? '/translate_api' : 'http://api_translate.mgaronya.com/translator/translate'
}

export const iconBaseUrl = 'http://icon.mgaronya.com'
export const imgBaseUrl = 'http://api_img.mgaronya.com'
export const baseURL = import.meta.env.DEV ? '/api' : 'http://api_oj.mgaronya.com'

export const testBaseUrl = import.meta.env.DEV ? '/test' : 'http://test_oj.mgaronya.com/test'

export const tagBaseUrl = import.meta.env.DEV ? '/tag_api' : 'http://api_tag.mgaronya.com'

export const wsBaseUrl = 'ws://api_oj.mgaronya.com'

export const translateBaseUrl = import.meta.env.DEV ? '/translate_api' : 'http://api_translate.mgaronya.com/translator/translate'

export const baseConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
}

export const jsonConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
}

export const formConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'multipart/form-data'
    }
  }
}

export const createRequest = (options: { type?: string; baseURL: string }) => {
  const { type, baseURL } = options
  const urlType = type ? `${type}BaseUrl` : 'baseURL'
  const request = axios.create({
    baseURL: `${baseUrlObj[urlType]}/${baseURL}`
  })
  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  //响应拦截器
  request.interceptors.response.use(
    (response) => {
      const {
        data: { code }
      } = response
      if (code == 201 && !localStorage.getItem('token')) {
        const a = document.createElement('a')
        a.href = '/login'
        a.click()
      }
      return response
    },
    (error) => {
      const { code = '请求错误' } = error
      notification.error({
        message: code,
        description: '请检查网络设置'
      })
      return Promise.reject(error)
    }
  )

  return request
}
