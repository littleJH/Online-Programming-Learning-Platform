import { baseConfig, createRequest, formConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'file' })

export const uploadFileApi = (path: string, data: any) => {
  return request.post(`/upload/${path}`, data, formConfig())
}

export const downloadFileApi = (path: string, name: string) => {
  return request.get(`/download//${path}/${name}`)
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

export const showFileInfoApi = (path: string, name: string) => {
  return request.put(`/path//${path}/${name}`)
}

export const makeDirectoryApi = (path: string, name: string) => {
  return request.put(`/madir//${path}/${name}`)
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

export const deleteFileApi = (path: string, name: string) => {
  return request.delete(`/path//${path}/${name}`, baseConfig())
}

export const renameFileApi = (
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
  return request.put('/rename', data, formConfig())
}

export const moveCopyDirApi = (first: string, second: string) => {
  const data = new FormData()
  data.append('first', first)
  data.append('second', second)
  return request.put('/all/cp', data, formConfig())
}

export const deleteDirApi = (path: string, name: string) => {
  return request.delete(`/all/rm//${path}/${name}`, baseConfig())
}
