import { Outlet } from 'react-router-dom'

const CommunityRoot: React.FC = () => {
  return (
    <div className="w-full  flex">
      <div className="grow"></div>
      <Outlet></Outlet>
      <div className="grow"></div>
    </div>
  )
}

export default CommunityRoot
