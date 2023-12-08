import { baseConfig, createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'topic' })

export const createTopicApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getTopicApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updateTopicApi = (id: string, data: any) => {
  return request.post(`/update/${id}`, data, jsonConfig())
}

export const deleteTopicApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}

export const getTopicListApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getTopicProblemsApi = (
  id: string,
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(
    `/problem/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
  )
}

// search

export const searchProblemInTopicByTextApi = (
  id: string,
  text: string,
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(
    `/search/in/topic/${text}/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
  )
}

export const searchProblemInTopicByLabelApi = (
  id: string,
  labels: string[],
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(
    `/search/label/in/topic/${id}?labels=${labels}&pageNum=${pageNum}&pageSize=${pageSize}`,
  )
}

export const searchProblemInTopicByTextLabelApi = (
  id: string,
  text: string,
  labels: string[],
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(
    `/search/with/label/in/topic/${text}/${id}?labels=${labels}&pageNum=${pageNum}&pageSize=${pageSize}`,
  )
}
