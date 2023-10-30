import React, { useState } from 'react'
import Login from '@/views/Login/log/Login'
import Register from '@/views/Login/log/Register'
import LoginPic from '@/assets/Login.svg'
import { Divider } from 'antd'

const LoginRoot: React.FC = () => {
  const [mode, setmode] = useState<'Login' | 'Register'>('Login')
  return (
    <div className='w-full h-full flex'>
      <div
        className='grow flex justify-center'
        style={{
          fontSize: '3rem',
          fontWeight: '600'
        }}
      >
        <img
          src={LoginPic}
          className='w-1/2'
        ></img>
      </div>
      <Divider
        type='vertical'
        className='h-full w-16 '
      ></Divider>
      <div className='grow flex justify-center'>
        {mode === 'Login' && <Login setmode={setmode}></Login>}
        {mode === 'Register' && <Register setmode={setmode}></Register>}
      </div>
    </div>
  )
}

export default LoginRoot
