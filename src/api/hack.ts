import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'

const request = axios.create({
  baseURL: `${baseURL}/hack`
})

export const getHackApi = (id: string) => {
  return request.get(`/show/${id}`)
}
