import { headerNavState, pathNameState } from '@/store/appStore'
import myHooks from '@/tool/myHooks/myHooks'
import utils from '@/tool/myUtils/utils'
import { Menu } from 'antd'
import React from 'react'
import { useRecoilValue } from 'recoil'
import SiderNav from '../navbar/SiderNav'

const MobileHeaderNavbar: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  return <SiderNav mode="horizontal" header={headerNav}></SiderNav>
}

export default MobileHeaderNavbar
