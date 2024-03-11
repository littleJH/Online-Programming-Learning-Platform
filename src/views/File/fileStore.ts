import { RecoilState, SetterOrUpdater, atom, selector, useRecoilState, useSetRecoilState } from 'recoil'
import { IFile } from '@/type'
import { makeDirectoryApi, showFileInfoApi, uploadFileApi } from '@/api/file'
import dayjs from 'dayjs'

interface IPath {
  path: string
  name: string
}

export interface IFileStore {
  viewType: 'list' | 'table'
  fileList: IFile[]
  history: IPath[]
  previousPath: IPath
  currentPath: IPath
  inputText: string
  showInput: boolean
  openUploadModal: boolean
  fileIconSize: number
  selectedFile: IFile[]
  openMenuItem: string | null
}

const fileStoreAtom = atom<IFileStore>({
  key: 'fileStoreAtom',
  default: {
    viewType: 'list',
    fileList: [],
    history: [],
    previousPath: { path: '', name: '' },
    currentPath: { path: '/', name: '' },
    inputText: '',
    showInput: false,
    openUploadModal: false,
    fileIconSize: 50,
    selectedFile: [],
    openMenuItem: null,
  },
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue, oldValue) => {
        // console.log('on fileStore set ==> ', { ...newValue })
        document.documentElement.style.setProperty('--file-item-width', newValue.fileIconSize + 'px')
      })
    },
  ],
})

export const fileStoreSelector = selector<IFileStore>({
  key: 'fileStoreSelector',
  get: async ({ get }) => {
    return get(fileStoreAtom)
  },
  set: ({ get, set }, newValue) => {
    const value = { ...newValue } as IFileStore
    set(fileStoreAtom, {
      ...value,
      currentPath: {
        path: value.currentPath.path.replace(/\.\/file/g, ''),
        name: value.currentPath.name,
      },
    })
  },
})

// const fileListSelector = selector<IFile[]>({
//   key: 'fileListSelector',
//   get: async ({ get }) => {
//     try {
//       const { currentPath } = get(fileStoreAtom)
//       // if (currentPath && currentPath.path && currentPath.name) {
//       const res = await showFileInfoApi(currentPath.path, currentPath.name)
//       return res.data.code === 200 ? res.data.data : []
//       // }
//       // return []
//     } catch {}
//   },
// })

export const Serv = {
  fetchFileList: async (params: { path: string; name: string }) => {
    try {
      const { path, name } = params
      const res = await showFileInfoApi(path, name)
      return res.data.code === 200 ? res.data.data : []
    } catch {}
  },
  mkdir: async (params: { path: string; name: string }) => {
    const { path, name } = params
    try {
      const res = await makeDirectoryApi(path, name)
      return res.data.data === 200
    } catch {}
  },
  upload: async (params: { path: string; data: any }) => {
    try {
      const res = await uploadFileApi(params.path, params.data)
      return res.data.data === 200 ? res.data.data.name : ''
    } catch {}
  },
}
