import { createRequest, baseConfig, formConfig, wsBaseUrl, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'message' })

export const createMessageApi = (uid: string, content: string) => {
  return request.post(`/create/${uid}`, JSON.stringify({ content }), jsonConfig())
}

export const deleteMessageApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}

export const getMessageListApi = (uid: string, pageNum?: number, pageSize?: number) => {
  return request.get(`/list/${uid}?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const setMessageAiApi = (data: { characters?: string; reply?: boolean; prologue?: string }) => {
  return request.post(`/ai/create`, JSON.stringify(data), jsonConfig())
}

export const deleteMessageAiApi = () => {
  return request.delete(`/ai/delete`, baseConfig())
}

export const getMessageAiApi = () => {
  return request.get('/ai/show', baseConfig())
}

export const updateMessageAiApi = (data: { characters?: string; reply?: boolean; prologue?: string }) => {
  return request.put(`/ai/update`, JSON.stringify(data), jsonConfig())
}
