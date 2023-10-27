import React, { useLayoutEffect } from 'react'
import { Outlet, redirect } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { loginStatusState } from '@/recoil/store'

const ProfileRoot: React.FC = () => {
  const info = useRecoilValue(loginStatusState)

  useLayoutEffect(() => {
    !info && redirect('/login')
  }, [])

  // const handleSubmenuOpenChange = (openkeys: string[]) => {
  //   const openkey = openkeys[openkeys.length - 1]
  //   openkey && nav(`/profile/${openkey}`)
  //   setOpenkeys([openkey])
  // }

  return (
    <div
      style={{
        minWidth: '768px'
      }}
    >
      <Outlet></Outlet>
    </div>
  )
}

export default ProfileRoot
