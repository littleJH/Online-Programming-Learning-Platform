import { createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'set' })

export const createFormApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getFormApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const getFormListApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// hot
export const getFormHotRankApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/hot/rank?pageNum=${pageNum}&pageSize=${pageSize}`)
}
