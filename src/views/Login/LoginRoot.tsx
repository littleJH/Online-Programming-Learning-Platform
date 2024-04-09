import React, { useState } from 'react'
import Login from '@/views/Login/log/Login'
import Register from '@/views/Login/log/Register'
import LoginPic from '@/assets/Login.svg'
import loginPic from '@/assets/login1.svg'
import style from './style.module.scss'
import { Divider } from 'antd'

const LoginRoot: React.FC = () => {
  const [mode, setmode] = useState<'Login' | 'Register'>('Login')
  return (
    <div className={style.root}>
      {/* <div className={style.left}></div> */}
      <div className={style.right}>
        {mode === 'Login' && <Login setmode={setmode}></Login>}
        {mode === 'Register' && <Register setmode={setmode}></Register>}
      </div>
    </div>
  )
}

export default LoginRoot
