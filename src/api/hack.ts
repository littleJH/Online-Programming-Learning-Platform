import { createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'hack' })

export const getHackApi = (id: string) => {
  return request.get(`/show/${id}`)
}
