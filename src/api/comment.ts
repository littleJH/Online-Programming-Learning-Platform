import { baseConfig, createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'comment' })

export const createCommentApi = (id: string, data: any) => {
  return request.post(`/create/${id}`, data, jsonConfig())
}

export const getCommentApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const getCommentListApi = (
  id: string,
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(`/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// like
export const likeCommentApi = (id: string, type: 'true' | 'false') => {
  return request.post(`/like/${id}?like=${type}`, {}, baseConfig())
}

export const cancelLikeCommentApi = (id: string) => {
  return request.delete(`/cancel/like/${id}`, baseConfig())
}

export const getCommentLikeNumApi = (id: string) => {
  return request.get(`/like/number/${id}`)
}

export const getCommentLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

export const getCommentHotRankApi = (
  id: string,
  pageNum: number = 1,
  pageSize: number = 20,
) => {
  return request.get(`/hot/rank/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}
