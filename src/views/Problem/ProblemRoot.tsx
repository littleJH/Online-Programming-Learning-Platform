import React, { Fragment } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const Root: React.FC = () => {
  return (
    <div className="h-full w-full flex">
      <div className="grow"></div>
      <Outlet></Outlet>
      <div className="grow"></div>
    </div>
  )
}

export default Root
