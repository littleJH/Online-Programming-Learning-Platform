import { baseConfig, createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'post' })

export const createPostApi = (id: string, data: any) => {
  return request.post(`/create/${id}`, data, jsonConfig())
}

export const getPostApi = (id: string) => {
  return request.get(`/show/${id}`)
}

// like
export const getPostListApi = (id: string, pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const likePostApi = (id: string, type: 'true' | 'false') => {
  return request.post(`/like/${id}?like=${type}`, {}, baseConfig())
}

export const cancelLikePostApi = (id: string) => {
  return request.delete(`/cancel/like/${id}`, baseConfig())
}

export const getPostLikeNumApi = (id: string) => {
  return request.get(`/like/number/${id}`)
}

export const getPostLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

export const getPostHotRankApi = (id: string, pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/hot/rank/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}
