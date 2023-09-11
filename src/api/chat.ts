import axios from 'axios'
import {
  baseURL,
  baseConfig,
  formConfig,
  jsonConfig,
  wsBaseUrl
} from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/chat`
})

export const craeteChatApi = (id: string, data: any) => {
  return request.post(`/send/${id}`, data, jsonConfig())
}

export const getGroupChatsApi = (id: string) => {
  return request.get(`/list/${id}`, baseConfig())
}

export const enterGroupPublishChatWS = (id: string) => {
  return new WebSocket(
    `${wsBaseUrl}/chat/receive/${id}?token=${localStorage.getItem('token')}`
  )
}

export const enterPublishChatWs = () => {
  return new WebSocket(
    `${wsBaseUrl}/chat/receivelink?token=${localStorage.getItem('token')}`
  )
}
