import axios from 'axios'
import { baseConfig, jsonConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'article' })

// article
export const createArticleApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getArticleApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const getArticleListApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const updateArticleApi = (id: string, data: any) => {
  return request.put(`/update/${id}`, data, jsonConfig())
}
export const deleteArticleApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}
// like
export const getArticleLikeNumApi = (id: string, type: 'true' | 'false') => {
  return request.get(`/like/number/${id}?like=${type}`)
}

export const getArticleLikeListApi = (id: string, type: 'true' | 'false', pageNum = 1, pageSize = 20) => {
  return request.get(`/like/list/${id}?like=${type}&pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getArticleLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

export const likeArticleApi = (id: string, type: 'true' | 'false') => {
  return request.post(`/like/${id}?like=${type}`, {}, baseConfig())
}

export const deleteLikeArticleApi = (id: string) => {
  return request.delete(`/cancel/like/${id}`, baseConfig())
}

// collect
export const getArticleCollectedApi = (id: string) => {
  return request.get(`/collect/show/${id}`, baseConfig())
}

export const getArticleCollectNumApi = (id: string) => {
  return request.get(`/collect/number/${id}`)
}

export const getArticleCollectListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/collect/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const collectArticleApi = (id: string) => {
  return request.post(`/collect/${id}`, {}, baseConfig())
}

export const deleteCollectArticleApi = (id: string) => {
  return request.delete(`/cancel/collect/${id}`, baseConfig())
}

// visit
export const setArticleVisibleApi = (id: string) => {
  return request.post(`/visit/${id}`, {}, baseConfig())
}

export const getArticleVisibleNumApi = (id: string) => {
  return request.get(`/visit/number/${id}`, baseConfig())
}

// label

export const createArticleLabelApi = (id: string, label: string) => {
  return request.post(`/label/${id}/${label}`, {}, jsonConfig())
}

export const getArticleLabelsApi = (id: string) => {
  return request.get(`/label/${id}`)
}

// hot
export const getArticleHotRankApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/hot/rank?pageNum=${pageNum}&pageSize=${pageSize}`)
}
