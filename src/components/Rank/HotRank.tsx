import { Card, List, Skeleton } from 'antd'
import React from 'react'
import style from './style.module.scss'
import MySvgIcon from '../Icon/MySvgIcon'

interface IProps {
  rankList: any[]
  onClick: (index: number) => void
}

const HotRank: React.FC<IProps> = (props) => {
  const { rankList, onClick } = props
  return (
    <Card
      size="small"
      className={style.hotRank}
      title={
        <div className="flex items-center">
          <span>热榜</span>
          <span>
            <MySvgIcon href="#icon-fire" size={1.5}></MySvgIcon>
          </span>
        </div>
      }
    >
      {rankList.length === 0 ? (
        <Skeleton active paragraph={{ rows: 9 }} className="px-4"></Skeleton>
      ) : (
        <List
          className={style.hotrank}
          size="small"
          split={false}
          dataSource={rankList}
          renderItem={(item, index) => (
            <List.Item
              key={item.id}
              style={{
                padding: '0px',
              }}
              className={style.item}
              onClick={() => onClick(index)}
            >
              <div className="flex items-center w-full">
                <span className="w-8 text-center">
                  {index <= 2 && (
                    <svg className="icon">
                      <use
                        href={
                          index === 0
                            ? '#icon-top-one'
                            : index === 1
                              ? '#icon-top-two'
                              : index === 2
                                ? '#icon-top-three'
                                : ''
                        }
                      ></use>
                    </svg>
                  )}
                </span>
                <span className={style.title}>{item.title}</span>
                <span className="flex items-center justify-center">
                  <span>
                    <svg className="icon-small">
                      <use href="#icon-fire"></use>
                    </svg>
                  </span>
                  <span className="text-right text-xs">{item.score}</span>
                </span>
              </div>
            </List.Item>
          )}
        ></List>
      )}
    </Card>
  )
}

export default HotRank
