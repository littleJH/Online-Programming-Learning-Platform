import { headerNavState, pathNameState } from '@/store/appStore'
import React from 'react'
import { useRecoilValue } from 'recoil'
import SubNavbar from '../Navbar/SubNavbar'

const MobileHeaderNavbar: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  return <SubNavbar mode="horizontal" header={headerNav}></SubNavbar>
}

export default MobileHeaderNavbar
