import { message } from 'antd'
import axios from 'axios'

const baseUrlObj: {
  [key: string]: string
} = {
  iconBaseUrl: 'http://icon.mgaronya.com',
  imgBaseUrl: 'http://api_img.mgaronya.com',
  imgGetBaseUrl: 'http://img.mgaronya.com',
  gptBaseUrl: 'http://api_chatgpt.mgaronya.com',
  wsBaseUrl: 'ws://106.53.120.252:2024',
  baseURL: import.meta.env.DEV ? '/api' : 'http://106.53.120.252:2024',
  testBaseUrl: import.meta.env.DEV ? '/test' : 'http://test_oj.mgaronya.com/test',
  tagBaseUrl: import.meta.env.DEV ? '/tag_api' : 'http://api_tag.mgaronya.com',
  translateBaseUrl: import.meta.env.DEV ? '/translate_api' : 'http://api_translate.mgaronya.com/translator/translate',
  fileBaseUrl: import.meta.env.Dev ? '/file_api' : 'http://106.53.120.252:2024',
}

export const wsBaseUrl = baseUrlObj.wsBaseUrl
export const translateBaseUrl = baseUrlObj.translateBaseUrl
export const iconBaseUrl = baseUrlObj.iconBaseUrl
export const imgBaseUrl = baseUrlObj.imgBaseUrl
export const tagBaseUrl = baseUrlObj.tagBaseUrl
export const baseURL = baseUrlObj.baseURL
export const imgGetBaseUrl = baseUrlObj.imgGetBaseUrl
export const testBaseUrl = baseUrlObj.testBaseUrl
export const fileBaseUrl = baseUrlObj.fileBaseUrl

export const baseConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  }
}

export const jsonConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
  }
}

export const formConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'multipart/form-data',
    },
  }
}

export const createRequest = (options: { type?: string; baseURL: string }) => {
  const { type, baseURL } = options
  const urlType = type ? `${type}BaseUrl` : 'baseURL'
  const request = axios.create({
    baseURL: `${baseUrlObj[urlType]}/${baseURL}`,
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
      const { data, request, config, headers, status, statusText } = response
      switch (data.code) {
        case 200:
          break
        case 201:
          // if (!localStorage.getItem('token') && location.pathname !== '/login') {
          //   const a = document.createElement('a')
          //   a.href = '/login'
          //   a.click()
          // } else {
          //   message.error(data.msg)
          // }
          break
        default:
          message.error(`${data.msg}`)
          break
      }
      return response
    },
    (error) => {
      const { code = '请求错误' } = error
      message.error(`${code}`)
      return Promise.reject(error)
    }
  )

  return request
}
