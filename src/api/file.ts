import { baseConfig, createRequest, formConfig, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'file', type: 'file' })

export const uploadFileApi = (path: string, data: any) => {
  return request.post(`/upload?path=${path}`, data, formConfig())
}

export const downloadFileApi = (path: string) => {
  return request.get(`/download?path=${path}`, baseConfig())
}

export const unzipFileApi = (first: string, second: string) => {
  return request.put('/unzip', { first, second }, jsonConfig())
}

export const showFileInfoApi = (path: string) => {
  return request.get(`/path?id=${path}`, baseConfig())
}

export const makeDirectoryApi = (path: string, name: string) => {
  return request.put(`/mkdir?id=${path}${name}`, {}, baseConfig())
}

export const moveCopyFileApi = (first: string, second: string) => {
  return request.put('/cp', { first, second }, jsonConfig())
}

export const deleteFileApi = (path: string) => {
  return request.delete(`/rm?id=${path}`, baseConfig())
}

export const renameFileApi = (first: string, second: string) => {
  return request.put('/rename', { first, second }, jsonConfig())
}

export const moveCopyDirApi = (first: string, second: string) => {
  return request.put('/all/cp', { first, second }, jsonConfig())
}

export const deleteDirApi = (path: string) => {
  return request.delete(`/all/rm?id=${path}`, baseConfig())
}
