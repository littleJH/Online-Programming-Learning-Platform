import React, { useState } from 'react'
import Login from '@/components/Login/Login'
import Register from '@/components/Login/Register'
import style from './style.module.scss'
import { Divider } from 'antd'

const LoginRoot: React.FC = () => {
  const [mode, setmode] = useState<'Login' | 'Register'>('Login')
  return (
    <div className={style.root}>
      {/* <div className={style.left}></div> */}
      <div className={style.right}>
        {/* {mode === 'Login' && <Login setmode={setmode}></Login>} */}
        {/* {mode === 'Register' && <Register setmode={setmode}></Register>} */}
      </div>
    </div>
  )
}

export default LoginRoot
