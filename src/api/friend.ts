import { createRequest, baseConfig, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'friend' })

//apply
export const applyAddFriendpApi = (id: string, data: any) => {
  return request.post(`/apply/${id}`, data, jsonConfig())
}
