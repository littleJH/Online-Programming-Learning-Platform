import { RecoilState, SetterOrUpdater, atom, selector, useRecoilState, useSetRecoilState } from 'recoil'
import { IFile } from '@/type'
import { makeDirectoryApi, showFileInfoApi, uploadFileApi } from '@/api/file'

export interface IFileStore {
  viewType: 'list' | 'table'
  fileList: IFile[]
  backStack: string[]
  forwardStack: string[]
  currentPath: string
  inputText: string
  openUploadModal: boolean
  fileIconSize: number
  selectedFile: IFile[]
  copyFile: IFile[]
  cutFile: IFile[]
}

export const atoms = {
  viewTypeState: atom<'list' | 'table'>({
    key: 'viewType',
    default: 'list',
  }),
  fileListState: atom<IFile[]>({
    key: 'fileList',
    default: [],
  }),
  backStackState: atom<string[]>({
    key: 'backStack',
    default: [],
  }),
  forwardStackState: atom({
    key: 'forwardStack',
    default: ['/'],
  }),
  currentPathState: atom({
    key: 'currentPath',
    default: '/',
  }),
  inputTextState: atom({
    key: 'inputText',
    default: '',
  }),
  openUploadModalState: atom({
    key: 'openUploadModal',
    default: false,
  }),
  fileIconSizeState: atom({
    key: 'fileIconSize',
    default: 75,
  }),
  selectedFileState: atom<IFile[]>({
    key: 'selectedFile',
    default: [],
  }),
  copyFileState: atom<IFile[]>({
    key: 'copyFile',
    default: [],
  }),
  cutFileState: atom<IFile[]>({
    key: 'cutFile',
    default: [],
  }),
}

export const fileStoreSelector = selector<IFileStore>({
  key: 'fileStoreSelector',
  get: ({ get }) => {
    return {
      viewType: get(atoms.viewTypeState),
      fileList: get(atoms.fileListState),
      backStack: get(atoms.backStackState),
      forwardStack: get(atoms.forwardStackState),
      currentPath: get(atoms.currentPathState),
      inputText: get(atoms.inputTextState),
      openUploadModal: get(atoms.openUploadModalState),
      fileIconSize: get(atoms.fileIconSizeState),
      selectedFile: get(atoms.selectedFileState),
      copyFile: get(atoms.copyFileState),
      cutFile: get(atoms.cutFileState),
    }
  },
})
