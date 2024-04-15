import { baseConfig, createRequest, jsonConfig, wsBaseUrl } from '../config/apiConfig'

const request = createRequest({ baseURL: 'competition' })

export const createCompetitionApi = (data: any) => {
  return request.post(`/create`, data, jsonConfig())
}

export const showCompetitionApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updateCompetitionApi = (id: string, data: any) => {
  return request.put(`/update/${id}`, data, jsonConfig())
}

export const deleteCompetitionApi = (id: string) => {
  return request.delete(`/delete/${id}`, jsonConfig())
}

export const getCompetitionListApi = (type: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/list?type=${type}&pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getMemberRankApi = (competition_id: string, member_id: string) => {
  return request.get(`/member/rank/${competition_id}/${member_id}`)
}

export const getMemberPenaltiesApi = (competition_id: string, member_id: string) => {
  return request.get(`/member/show/${competition_id}/${member_id}`)
}

export const getCompetitionRankListApi = (id: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/rank/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const rollingRanklistWs = (id: string) => {
  return `${wsBaseUrl}/competition/rolling/list/${id}`
}

// 搜索
export const searchComByTextApi = (text: string, pageNum: number, pageSize: number) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const searchComByLabelApi = (labels: string, pageNum: number, pageSize: number) => {
  return request.get(`/search/label?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`)
}

export const searchComByTextAndLabelApi = (text: string, labels: string, pageNum: number, pageSize: number) => {
  return request.get(`/search/with/label/${text}?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`)
}

// 密码
export const createCompPwApi = (competition_id: string, data: any) => {
  return request.post(`/passwd/create/${competition_id}`, data, jsonConfig())
}

export const deleteCompPwApi = (competition_id: string) => {
  return request.delete(`/passwd/delete/${competition_id}`, baseConfig())
}

// 标签
export const getComLabels = (competition_id: string) => {
  return request.get(`/label/${competition_id}`)
}
export const createComLabels = (competition_id: string, label: string) => {
  return request.post(`/label/create/${competition_id}/${label}`, {}, baseConfig())
}
export const deleteComLabels = (competition_id: string, label: string) => {
  return request.delete(`/label/delete/${competition_id}/${label}`, baseConfig())
}
