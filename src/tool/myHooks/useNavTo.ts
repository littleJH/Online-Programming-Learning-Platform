import { useNavigate } from 'react-router-dom'
import { INavOptions } from '@/type'
import { headerNavState, loginStatusState, pathNameState } from '@/store/appStore'
import { useSetRecoilState, useResetRecoilState, useRecoilValue } from 'recoil'
import { getPathArray } from '../MyUtils/utils'

const useNavTo = () => {
  const nav = useNavigate()
  const setPathNameState = useSetRecoilState(pathNameState)
  const loginStatus = useRecoilValue(loginStatusState)
  const navTo = (path: string) => {
    const authPath = ['profile']
    const pathArr = getPathArray(path)
    const shouldAuth = authPath.includes(pathArr[0])

    if (shouldAuth && !loginStatus) {
      nav('/login')
    } else {
      nav(path)
    }
    setPathNameState(location.pathname)
  }

  return navTo
}

export default useNavTo
