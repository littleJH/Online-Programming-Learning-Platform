import React, { Fragment } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const Root: React.FC = () => {
  return (
    <Fragment>
      {/* <div className="w-full h-wull">
        <Button>
          <NavLink to={'list'}>tolist</NavLink>
        </Button>
        <Button>
          <NavLink to={'create'}>tocreatet</NavLink>
        </Button>
      </div> */}
      <Outlet></Outlet>
    </Fragment>
  )
}

export default Root
