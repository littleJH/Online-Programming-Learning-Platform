import { baseConfig, jsonConfig, formConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'notice/board' })

export const createNoticeBoardApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getNoticeBoardApi = (id: string) => {
  return request.get(`/show/${id}`, baseConfig())
}

export const updateNoticeBoardApi = (data: any) => {
  return request.put('/update', data, jsonConfig())
}

export const deleteNoticeBoardApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}

export const getNoticeBoardListApi = (pageNum: number, pageSize: number) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`, jsonConfig())
}
