import { baseConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'tag', type: 'tag' })

export const createTagApi = (tag: string) => {
  return request.post(`/create/${tag}`)
}

export const createTagAutoApi = (text: string, translate: boolean = true) => {
  return request.get(`/auto/${translate}?text=${text}`, baseConfig())
}

export const getTagListApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}
