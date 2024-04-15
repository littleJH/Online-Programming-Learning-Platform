import React from 'react'
import HDU from '@/assets/ojIcons/banner.jpg'
import codeforces from '@/assets/ojIcons/codeforces-sponsored-by-ton.png'
import hackerrank from '@/assets/ojIcons/hackerrank_logo.png'
import vijos from '@/assets/ojIcons/header-logo-summer.png'
import atcoder from '@/assets/ojIcons/logo.png'
import pku from '@/assets/ojIcons/logo0.gif'
import uoj from '@/assets/ojIcons/UOJ_small.png'
import toj from '@/assets/ojIcons/usu-summer.jpg'
import { Space } from 'antd'

const oj = [
  {
    name: 'HDU Online Judge',
    link: 'http://acm.hdu.edu.cn/',
    img: HDU,
  },
  {
    name: 'PKU JudgeOnline',
    link: 'http://poj.org/',
    img: pku,
  },

  {
    name: 'Codeforces',
    link: 'https://codeforces.com/',
    img: codeforces,
  },
  {
    name: 'HackerRank',
    link: 'https://www.hackerrank.com/',
    img: hackerrank,
  },
  {
    name: 'Vijos',
    link: 'https://www.vijos.com/',
    img: vijos,
  },
  {
    name: 'AtCoder',
    link: 'https://atcoder.jp/',
    img: atcoder,
  },

  {
    name: 'UOJ',
    link: 'https://uoj.ac/',
    img: uoj,
  },
  {
    name: 'Timus Online Judge',
    link: 'https://acm.timus.ru/',
    img: toj,
  },
]

const OjPlatform: React.FC = () => {
  return (
    <Space wrap>
      {oj.map((item, index) => (
        <a target="_blank" href={item.link} key={index}>
          <img height={50} src={item.img} alt={item.name} />
        </a>
      ))}
    </Space>
  )
}

export default OjPlatform
