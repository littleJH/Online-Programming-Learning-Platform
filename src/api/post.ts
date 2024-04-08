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

export const getPostLikeNumApi = (id: string, type: 'true' | 'false') => {
  return request.get(`/like/number/${id}?like=${type}`)
}

export const getPostLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

// collect
export const getPostCollectedApi = (id: string) => {
  return request.get(`/collect/show/${id}`, baseConfig())
}

export const getPostCollectNumApi = (id: string) => {
  return request.get(`/collect/number/${id}`)
}

export const getPostCollectListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/collect/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const collectPostApi = (id: string) => {
  return request.post(`/collect/${id}`, {}, baseConfig())
}

export const deleteCollectPostApi = (id: string) => {
  return request.delete(`/cancel/collect/${id}`, baseConfig())
}

// visit
export const setPostVisibleApi = (id: string) => {
  return request.post(`/visit/${id}`, {}, baseConfig())
}

export const getPostVisibleNumApi = (id: string) => {
  return request.get(`/visit/number/${id}`, baseConfig())
}

// label

export const createPostLabelApi = (id: string, label: string) => {
  return request.post(`/label/${id}/${label}`, {}, jsonConfig())
}

export const getPostLabelsApi = (id: string) => {
  return request.get(`/label/${id}`)
}

// hot
export const getPostHotRankApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/hot/rank/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// search
export const searchPostsApi = (text: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}
