import React, { useEffect, useState, useLayoutEffect, useMemo } from 'react'
import { Layout, Button, Avatar, theme, Divider, Popover, Space, Modal } from 'antd'
import { Outlet } from 'react-router-dom'
import { iconBaseUrl } from '@/config/apiConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  isDarkState,
  isMobileAtom,
  loginStatusState,
  pathNameState,
  sideBarTypeState,
  userInfoState,
} from '@/store/appStore'
import Sider from 'antd/es/layout/Sider'
import SubNavbar from '@/components/Navbar/SubNavbar'
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
import style from './style.module.scss'
import UserInfo from '@/components/User/UserInfo'
import UserCard from '@/components/User/UserCard'
import { getCurrentUserinfo } from '@/api/user'
import reactIcon from '@/assets/react.svg'
import Login from '@/components/Login/Login'
import Register from '@/components/Login/Register'

const fullPath = ['/creation/article', '/creation', '/file']
const icp = '粤ICP备2024297311号-1'

const Root: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  const isMobile = useRecoilValue(isMobileAtom)
  const { Header, Content, Footer } = Layout
  const { token } = theme.useToken()
  const [isDark, setIsDark] = useRecoilState(isDarkState)
  const footerRight = useRecoilValue(footerRightNode)
  const pathname = useRecoilValue(pathNameState)
  const sideBarType = useRecoilValue(sideBarTypeState)
  const [myInfo, setMyInfo] = useRecoilState(userInfoState)
  const loginStatus = useRecoilValue(loginStatusState)
  const [loginMode, setLoginMode] = useState<'Login' | 'Register'>('Login')
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openSelfCard, setOpenSelfCard] = useState(false)
  const nav = myHooks.useNavTo()

  useEffect(() => {
    if (pathname === '' || pathname === '/') nav('/home')
  }, [])

  useEffect(() => {
    initCustomProperties()
  }, [token])

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const sidebarWidth = useMemo(() => {
    let width = 0
    if (sideBarType === 'directory') width = 300
    if (sideBarType === 'nav') width = 200
    if (sideBarType === 'competitionRank') width = 300
    if (sideBarType === 'none') width = 0
    return width
  }, [sideBarType])

  const showPaddingY = React.useMemo(
    () => !['problemdetail', 'competitiondetail'].includes(utils.getPathArray(pathname)[0]) && !isMobile,
    [pathname, isMobile]
  )
  const full = React.useMemo(() => {
    return fullPath.includes(pathname) || pathname.includes('problemdetail') || isMobile
  }, [pathname, isMobile])

  const fetchUserInfo = async () => {
    try {
      const res = await getCurrentUserinfo()
      setMyInfo(res.data.data.user)
    } catch (err) {
      if (['/login', '/home', '/'].includes(location.pathname)) return
      const a = document.createElement('a')
      a.href = '/login'
      a.click()
    }
  }

  const initCustomProperties = () => {
    const body = document.getElementsByTagName('body')[0]
    body.style.setProperty('--colorPrimary', token.colorPrimary)
    body.style.setProperty('--colorSuccess', token.colorSuccess)
    body.style.setProperty('--colorWarning', token.colorWarning)
    body.style.setProperty('--colorError', token.colorError)
    body.style.setProperty('--colorInfo', token.colorInfo)
    body.style.setProperty('--colorBgBase', token.colorBgBase)
    body.style.setProperty('--colorTextBase', token.colorTextBase)
    body.style.setProperty('--colorBgBlur', token.colorBgBlur)
    body.style.setProperty('--colorBgBlur', token.colorBgBlur)
    body.style.setProperty('--colorBorder', token.colorBorder)
  }

  const headerStyle: React.CSSProperties = {
    backgroundColor: `${isDark ? '#141414' : '#ffffff'}`,
    boxShadow: token.boxShadowTertiary,
  }

  const siderStyle: React.CSSProperties = {
    color: token.colorTextBase,
    backgroundColor: token.colorBgBase,
    transition: 'all 500',
  }

  return (
    <>
      <Layout className={style.layout}>
        {/* {!isMobile && ( */}
        <Header className={style.header} style={headerStyle}>
          <div className={style.pc}>
            <Button type="text" className="flex items-center h-12 p-2">
              <MySvgIcon href="coding" size={8} color={token.colorPrimary}></MySvgIcon>
            </Button>
            <Navbar headerNav={headerNav}></Navbar>
            <Button type="text" className="flex items-center h-12 p-2" onClick={() => setIsDark((value) => !value)}>
              <MySvgIcon
                href={`#icon-${isDark ? 'light' : 'dark'}`}
                size={2}
                color={`${isDark ? '#fff' : '#000'}`}
              ></MySvgIcon>
            </Button>
            {myInfo?.level && myInfo?.level >= 4 ? (
              <Button type="text" className="flex items-center h-12 p-2" onClick={() => nav('/file')}>
                <MySvgIcon href="#icon-folder" size={2} color={token.colorWarning}></MySvgIcon>
              </Button>
            ) : null}
            {!loginStatus && (
              <Button type="link" className="flex items-center h-12 p-2 mr-4">
                <div className="h-full flex items-center" onClick={() => setOpenLoginModal(true)}>
                  登录
                </div>
              </Button>
            )}
            {loginStatus && myInfo && (
              <Popover placement="left" content={<UserCard user={myInfo} showMenu></UserCard>}>
                <Button type="text" className="flex items-center h-12 p-2 mr-4">
                  <div className="h-full flex items-center">
                    <Avatar
                      className="hover:cursor-pointer"
                      alt="登录"
                      src={`${myInfo?.icon ? `${iconBaseUrl}/${myInfo?.icon}` : reactIcon}`}
                    ></Avatar>
                  </div>
                </Button>
              </Popover>
            )}
          </div>
          <div className={style.mobile}>
            <MobileHeaderNavbar></MobileHeaderNavbar>
          </div>
        </Header>
        {/* )} */}
        {/* {isMobile && <MobileHeaderNavbar></MobileHeaderNavbar>} */}
        <Content
          className={style.content}
          style={{
            backgroundColor: token.colorBgBlur,
          }}
        >
          <Layout className="h-full" hasSider>
            {/* {!['login', 'problemdetail'].includes(headerNav) && (
            <Sider className={style.sider} style={siderStyle} collapsible trigger={null} width={sidebarWidth}>
              {sideBarType === 'nav' && <SubNavbar header={headerNav} mode="inline"></SubNavbar>}
              {sideBarType === 'directory' && <Directory></Directory>}
              {sideBarType === 'competitionRank' && <Rank mode="sider"></Rank>}
            </Sider>
          )} */}
            {/* {sideBarType === 'directory' && (
            <Sider className={style.sider} style={siderStyle} collapsible trigger={null} width={sidebarWidth}>
              <Directory></Directory>
            </Sider>
          )} */}
            <Content
              id="content"
              className={style.subContent}
              style={{
                padding: `${showPaddingY ? '1rem 0' : '0'}`,
              }}
            >
              <div className={style.outletCtn} style={{ width: full ? '100%' : 'min-content' }}>
                <Outlet></Outlet>
              </div>
            </Content>
          </Layout>
        </Content>
        <Footer className={style.footer}>
          <div className={style.pc}>
            {/* left */}
            <div className="w-1/3"></div>
            <div className={style.center} style={{}}>
              <Space split={<Divider type="vertical"></Divider>}>
                {!loginStatus && (
                  <Button type="link" onClick={() => setOpenLoginModal(true)}>
                    登录 · 注册
                  </Button>
                )}
                <Button type="link" onClick={() => window.open('https://beian.miit.gov.cn')}>
                  {icp}
                </Button>
                <Button type="link">@XXX · 联系我们 · 2024</Button>
              </Space>
            </div>
            {/* right */}
            <div className="w-1/3 flex items-center justify-end">{footerRight}</div>
          </div>
          <div className={style.mobile}>
            <MobileFooterNavbar></MobileFooterNavbar>
          </div>
        </Footer>
      </Layout>
      <Modal
        open={openLoginModal && !loginStatus}
        footer={[]}
        onCancel={() => setOpenLoginModal(false)}
        styles={{
          body: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem 2rem 0 2rem',
          },
        }}
      >
        {loginMode === 'Login' && <Login setmode={setLoginMode} setOpenModal={setOpenLoginModal}></Login>}
        {loginMode === 'Register' && <Register setmode={setLoginMode} setOpenModal={setOpenLoginModal}></Register>}
      </Modal>
    </>
  )
}

export default Root
