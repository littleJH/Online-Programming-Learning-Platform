import { baseConfig, createRequest, formConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'file', type: 'file' })

export const uploadFileApi = (path: string, data: any) => {
  return request.post(`/upload?path=${path}`, data, formConfig())
}

export const downloadFileApi = (path: string) => {
  return request.get(`/download?path=${path}`, baseConfig())
}

export const unzipFileApi = (
  first: {
    path: string
    name: string
  },
  second: string
) => {
  const { path, name } = first
  const data = new FormData()
  data.append('first', `/${path}/${name}`)
  data.append('second', second)
  return request.put('/unzip', data, formConfig())
}

export const showFileInfoApi = (path: string) => {
  return request.get(`/path?id=${path}`, baseConfig())
}

export const makeDirectoryApi = (path: string, name: string) => {
  return request.put(`/madir?path=${path}/${name}`, {}, baseConfig())
}

export const moveCopyFileApi = (
  first: {
    path: string
    name: string
  },
  second: string
) => {
  const { path, name } = first
  const data = new FormData()
  data.append('first', `/${path}/${name}`)
  data.append('second', second)
  return request.put('/cp', data, formConfig())
}

export const deleteFileApi = (path: string) => {
  return request.delete(`/rm?path=${path}`, baseConfig())
}

export const renameFileApi = (first: string, second: string) => {
  const data = new FormData()
  data.append('first', first)
  data.append('second', second)
  return request.put('/rename', data, formConfig())
}

export const moveCopyDirApi = (first: string, second: string) => {
  const data = new FormData()
  data.append('first', first)
  data.append('second', second)
  return request.put('/all/cp', data, formConfig())
}

export const deleteDirApi = (path: string) => {
  return request.delete(`/all/rm?path=${path}`, baseConfig())
}
