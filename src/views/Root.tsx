import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react'
import { Layout, Button, Avatar, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import { iconBaseUrl } from '@/config/apiConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isDarkState, loginStatusState, pathNameState, sideBarTypeState, userInfoState } from '@/store/appStore'
import Sider from 'antd/es/layout/Sider'
import SiderNav from '@/components/navbar/SiderNav'
import Navbar from '@/components/Navbar/Navbar'
import { headerNavState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { footerRightNode } from '@/store/nodeStore'
import myHooks from '@/tool/myHooks/myHooks'
import Directory from '@/components/directory/Directory'
import Rank from './Competition/CompetitionCommon/pages/CompetitionDetail/pages/Rank/Index'
import FileInfo from './File/component/FileInfo'
import MobileFooterNavbar from '@/components/mobile/MobileFooterNavbar'
import MobileHeaderNavbar from '@/components/mobile/MobileHeaderNavbar'

const isMobile = utils.getIsMobile()

const Root: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  const { Header, Content, Footer } = Layout
  const { token } = theme.useToken()
  const [isDark, setIsDark] = useRecoilState(isDarkState)
  const footerRight = useRecoilValue(footerRightNode)
  const pathname = useRecoilValue(pathNameState)
  const sideBarType = useRecoilValue(sideBarTypeState)
  const myInfo = useRecoilValue(userInfoState)
  const loginStatus = useRecoilValue(loginStatusState)
  const nav = myHooks.useNavTo()

  useLayoutEffect(() => {
    if (pathname === '' || pathname === '/') nav('/home')
  }, [])

  useEffect(() => console.log('headerNav ==> ', headerNav), [headerNav])
  useEffect(() => console.log('sideBarType ==> ', sideBarType), [sideBarType])

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    // body.style.setProperty('--colorBgBase', token.colorBgBase)
    // body.style.setProperty('--colorTextBase', token.colorTextBase)
    // body.style.setProperty('--colorBgBlur', token.colorBgBlur)
    // body.style.setProperty('--colorBgBlur', token.colorBgBlur)
    body.style.setProperty('--colorBorder', token.colorBorder)
  }, [token])

  const sidebarWidth = useMemo(() => {
    let width = 0
    if (sideBarType === 'directory') width = 300
    if (sideBarType === 'nav') width = 200
    if (sideBarType === 'competitionRank') width = 300
    if (sideBarType === 'none') width = 0
    return width
  }, [sideBarType])

  const showPaddingY = React.useMemo(
    () => !['problemdetail', 'competitiondetail'].includes(utils.getPathArray(pathname)[0]) && !utils.getIsMobile(),
    [pathname]
  )
  const full = React.useMemo(() => {
    const fullPath = ['/creation/article', '/file']
    return fullPath.includes(pathname) || pathname.includes('problemdetail')
  }, [pathname])

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${isDark ? '#141414' : '#ffffff'}`,
    boxShadow: token.boxShadowTertiary,
  }

  const siderStyle: React.CSSProperties = {
    color: token.colorTextBase,
    backgroundColor: token.colorBgBase,
    transition: 'all 500',
  }

  const footerStyle: React.CSSProperties = {
    padding: '0',
    position: 'sticky',
    bottom: '0',
  }

  return (
    <Layout className="w-full h-full">
      {!isMobile && (
        <Header className="sticky top-0 z-10 p-0 flex items-center" style={headerStyle}>
          <Navbar headerNav={headerNav}></Navbar>

          <Button type="text" className="flex items-center h-12 p-2" onClick={() => setIsDark((value) => !value)}>
            <MySvgIcon
              href={`#icon-${isDark ? 'light' : 'dark'}`}
              size={2}
              color={`${isDark ? '#fff' : '#000'}`}
            ></MySvgIcon>
          </Button>
          {myInfo?.level && myInfo?.level >= 4 && (
            <Button type="text" className="flex items-center h-12 p-2" onClick={() => nav('/file')}>
              <MySvgIcon href="#icon-folder" size={2} color={token.colorWarning}></MySvgIcon>
            </Button>
          )}
          <Button type="text" className="flex items-center h-12 p-2 mr-4">
            <div className="h-full flex items-center" onClick={() => nav('/profile')}>
              {loginStatus && (
                <Avatar className="hover:cursor-pointer" alt="登录" src={`${iconBaseUrl}/${myInfo?.icon}`}></Avatar>
              )}
              {!loginStatus && <Button type="link">登录</Button>}
            </div>
          </Button>
        </Header>
      )}
      {isMobile && <MobileHeaderNavbar></MobileHeaderNavbar>}
      <Content
        className="w-full h-full"
        style={{
          backgroundColor: token.colorBgBlur,
        }}
      >
        <Layout className="h-full" hasSider>
          {!['login', 'problemdetail'].includes(headerNav) && (
            <Sider style={siderStyle} collapsible trigger={null} width={sidebarWidth}>
              {sideBarType === 'nav' && <SiderNav header={headerNav} mode="inline"></SiderNav>}
              {sideBarType === 'directory' && <Directory></Directory>}
              {sideBarType === 'competitionRank' && <Rank mode="sider"></Rank>}
            </Sider>
          )}
          <Content
            id="content"
            style={{
              padding: `${showPaddingY ? '1rem 0' : '0'}`,
              position: 'relative',
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              height: '100%',
            }}
          >
            <div className="h-full" style={{ width: full ? '100%' : 'min-content', margin: 'auto' }}>
              <Outlet></Outlet>
            </div>
          </Content>
        </Layout>
      </Content>

      <Footer style={footerStyle}>
        {!isMobile && (
          <>
            {/* left */}
            <div
              className="w-1/2"
              style={{
                display: 'inline-block',
                minHeight: '2rem',
              }}
            ></div>
            {/* right */}
            <div
              className="w-1/2 flex items-center"
              style={{
                display: 'inline-block',
              }}
            >
              {footerRight}
            </div>
          </>
        )}
        {isMobile && <MobileFooterNavbar></MobileFooterNavbar>}
      </Footer>
    </Layout>
  )
}

export default Root
