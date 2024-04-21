import { baseConfig, createRequest, wsBaseUrl } from '@/config/apiConfig'

const request = createRequest({
  baseURL: 'heart',
})

export const getHeartConditionApi = (id: string, start: string, end: string) => {
  return request.get(`/show/${id}/${start}/${end}`, baseConfig())
}

export const getHeartPublishWs = (id: string) => {
  return `${wsBaseUrl}/publish/${id}`
}

export const getHeartPercentageApi = () => {
  return request.get('/percentage', baseConfig())
}
