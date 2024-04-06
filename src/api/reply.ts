import { createRequest, baseConfig, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'reply' })

export const createCommentReplyApi = (id: string, data: any) => {
  return request.post(`/create/${id}`, data, jsonConfig())
}

export const getCommentReplyListApi = (id: string, pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// like
export const getReplyLikeNumApi = (id: string, type: 'true' | 'false' = 'true') => {
  return request.get(`/like/number/${id}?like=${type}`)
}

export const getReplyLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

export const likeReplyApi = (id: string, type: 'true' | 'false') => {
  return request.post(`/like/${id}?like=${type}`, {}, baseConfig())
}

export const cancelLikeReplyApi = (id: string) => {
  return request.delete(`/cancel/like/${id}`, baseConfig())
}
