import { Menu } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import utils from '@/tool/myUtils/utils'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import myHooks from '@/tool/myHooks/myHooks'
import { siderMenuItemsObj } from '@/router/router'

const SubNavbar: React.FC<{ header: string; mode: 'horizontal' | 'inline' }> = (props) => {
  const { header, mode } = props
  const [current, setCurrent] = useState('')
  const [menuItem, setMenuItem] = useState([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const pathname = useRecoilValue(pathNameState)
  const navTo = myHooks.useNavTo()
  const patharr = utils.getPathArray(pathname)

  useEffect(() => {
    const menuItems = siderMenuItemsObj[`${header}MenuItem`]
    setMenuItem(menuItems)
    if (header === 'problemdetail') {
      setCurrent(patharr[2])
    } else {
      setCurrent(patharr[1])
    }
    menuItems?.length > 0 &&
      menuItems.forEach((item: any) => {
        if (item.children && patharr.length > 1) {
          item.children.forEach((item1: any) => {
            patharr.length === 2 && patharr[1] === item1.key && setOpenKeys([item.key])
            patharr.length === 3 && patharr[1] === item.key && setOpenKeys([item.key])
          })
        }
      })
  }, [header, pathname])

  useEffect(() => console.log('openKeys ==> ', openKeys), [openKeys])

  const handleMenuClick = (e: any) => {
    setCurrent(e.key)
    if (header === 'problemdetail') {
      navTo(`/${header}/${patharr[1]}/${e.key}`)
    } else {
      navTo(`/${header}/${e.key}`)
    }
  }

  const handleOpenChange = (keys: string[]) => {
    // console.log('openKeys ==> ', keys)
    // if (keys.length > 1) {
    //   const index = keys.indexOf(openKeys[0])
    //   index === 0 && keys.shift()
    //   index === 1 && keys.pop()
    // }
    setOpenKeys(keys)
  }

  return (
    <Menu
      style={{
        height: mode === 'horizontal' ? '50px' : '100%',
        userSelect: 'none',
        padding: mode === 'horizontal' ? '0' : '0 1rem',
      }}
      selectedKeys={[current]}
      mode={mode}
      onClick={handleMenuClick}
      items={menuItem}
      openKeys={mode === 'horizontal' ? undefined : openKeys}
      onOpenChange={handleOpenChange}
    ></Menu>
  )
}

export default SubNavbar
