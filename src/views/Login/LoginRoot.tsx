import React, { useState } from 'react'
import Login from '@/views/Login/Log/Login'
import Register from '@/views/Login/Log/Register'
import { Divider } from 'antd'
import LoginPic from '@/assets/Login.svg'

const LoginRoot: React.FC = () => {
  const [mode, setmode] = useState<'Login' | 'Register'>('Login')
  return (
    <div className="w-full h-full flex">
      <div
        className="w-2/3 flex justify-center"
        style={{
          fontSize: '3rem',
          fontWeight: '600'
        }}
      >
        <img src={LoginPic} className="w-full"></img>
      </div>
      <div className="w-1/3">
        {mode === 'Login' && <Login setmode={setmode}></Login>}
        {mode === 'Register' && <Register setmode={setmode}></Register>}
      </div>
    </div>
  )
}

export default LoginRoot
