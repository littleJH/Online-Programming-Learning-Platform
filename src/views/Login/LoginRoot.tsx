import React, { useState } from 'react'
import Login from '@/views/Login/log/Login'
import Register from '@/views/Login/log/Register'
import LoginPic from '@/assets/Login.svg'
import style from './style.module.scss'

const LoginRoot: React.FC = () => {
  const [mode, setmode] = useState<'Login' | 'Register'>('Login')
  return (
    <div className={style.root}>
      {/* <div
        className="grow flex justify-center w-1/4"
        style={{
          fontSize: '3rem',
          fontWeight: '600',
        }}
      >
        <img src={LoginPic} className=""></img>
      </div> */}
      {/* <Divider type="vertical" className="h-full w-16 "></Divider> */}
      {mode === 'Login' && <Login setmode={setmode}></Login>}
      {mode === 'Register' && <Register setmode={setmode}></Register>}
    </div>
  )
}

export default LoginRoot
