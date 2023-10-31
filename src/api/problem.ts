import axios from 'axios'
import { createRequest, baseConfig, jsonConfig, formConfig, translateBaseUrl } from '../config/apiConfig'

const request = createRequest({ baseURL: 'problem' })

export const createProblemApi = (data: any, config = jsonConfig()) => {
  return request.post('/create', data, config)
}

export const showProblemApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updateProblemApi = (id: string, config = baseConfig()) => {
  return request.put(`/update/${id}`, config)
}

export const deleteProblemApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}

export const getProblemListApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// like

export const getProblemLikeNumApi = (id: string, type: 'true' | 'false') => {
  return request.get(`/like/number/${id}?like=${type}`)
}

export const getProblemLikeListApi = (id: string, type: 'true' | 'false', pageNum = 1, pageSize = 20) => {
  return request.get(`/like/list/${id}?like=${type}&pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getProblemLikedApi = (id: string) => {
  return request.get(`/like/show/${id}`, baseConfig())
}

export const likeProblemApi = (id: string, type: 'true' | 'false') => {
  return request.post(`/like/${id}?like=${type}`, {}, baseConfig())
}

export const deleteLikeProblemApi = (id: string) => {
  return request.delete(`/cancel/like/${id}`, baseConfig())
}

// collect

export const getProblemCollectedApi = (id: string) => {
  return request.get(`/collect/show/${id}`, baseConfig())
}

export const getProblemCollectNumApi = (id: string) => {
  return request.get(`/collect/number/${id}`)
}

export const getProblemCollectListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/collect/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const collectProblemApi = (id: string) => {
  return request.post(`/collect/${id}`, {}, baseConfig())
}

export const deleteCollectProblemApi = (id: string) => {
  return request.delete(`/cancel/collect/${id}`, baseConfig())
}

// visit
export const setProblemVisibleApi = (id: string) => {
  return request.post(`/visit/${id}`, {}, baseConfig())
}

export const getProblemVisibleNumApi = (id: string) => {
  return request.get(`/visit/number/${id}`, baseConfig())
}

// searth problem

export const searchProblemByTextApi = (text: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const searchProblemByLabelApi = (labels: string[], pageNum = 1, pageSize = 20) => {
  return request.get(`/search/label?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`)
}

export const searchProblemByTextAndLabelApi = (text: string, labels: string[], pageNum = 1, pageSize = 20) => {
  return request.get(`/search/with/label/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`)
}

// hot
export const getProblemHotRankApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/hot/rank?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// label

export const createProblemLabelApi = (id: string, label: string) => {
  return request.post(`/label/${id}/${label}`, {}, baseConfig())
}

export const getProblemLabelsApi = (id: string) => {
  return request.get(`/label/${id}`)
}

// translate
export const translateProblemApi = (text: string) => {
  return axios
    .create({
      baseURL: translateBaseUrl
    })
    .get('')
}

// other
export const getUserProblemListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/user/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getProblemTestNumApi = (id: string) => {
  return request.get(`/test/num/${id}`)
}

export const uploadProblemByFileApi = (data: any) => {
  return request.post('create/by/file', data, formConfig())
}

export const uploadVjudgeProblemApi = (data: any) => {
  return request.post('create/vjudge', data, jsonConfig())
}
