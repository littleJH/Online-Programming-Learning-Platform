import axios from 'axios'
import { baseURL, jsonConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/competition`
})

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

export const getCompetitionListApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getMemberRankApi = (competition_id: string, member_id: string) => {
  return request.get(`/member/rank/${competition_id}/${member_id}`)
}

export const getMemberPenaltiesApi = (
  competition_id: string,
  member_id: string
) => {
  return request.get(`/member/show/${competition_id}/${member_id}`)
}

export const getCompetitionRankListApi = (
  id: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(`/rank/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const rollingRanklistWs = (id: string) => {
  return new WebSocket(`ws://10.60.37.43:2000/competition/rolling/list/${id}`)
}
