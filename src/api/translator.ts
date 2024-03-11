import { createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'translate', type: 'translate' })

export const translateApi = (text: string) => {
  return request.post('', { text }, jsonConfig())
}
