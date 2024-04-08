import axios from 'axios'
import { baseConfig, createRequest, wsBaseUrl } from '../config/apiConfig'
import { CompetitionType } from '@/type'

const request = createRequest({ baseURL: '/competition/random/' })

export const enterRandomCompetitionApi = (type: CompetitionType | string) => {
  return request.post(`${type}/enter`, {}, baseConfig())
}

export const getRandomEnterConditionApi = (type: CompetitionType | string) => {
  return request.get(`${type}/enter/condition`, baseConfig())
}

export const cancelEnterRandomCompetitionApi = (type: CompetitionType | string) => {
  return request.delete(`${type}/cancel/enter`, baseConfig())
}

export const getEnterRandomCompetitionListApi = (type: CompetitionType | string) => {
  return request.get(`${type}/enter/list`)
}

export const enterPublishWs = () => {
  return new WebSocket(`${wsBaseUrl}/competition/random/single/enter/publish`)
}

export const getCompetitionRandomEnterPublishWs = () => {
  return `${wsBaseUrl}/competition/random/single/enter/publish`
}
