import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import 'animate.css'

const RollList: React.FC<{
  list: any[]
  renderItem: (item: any, index: number) => React.ReactNode
}> = props => {
  const { list, renderItem } = props

  return (
    <TransitionGroup>
      {list &&
        list.map((item, index) => (
          <CSSTransition
            classNames={{
              // appear: '',
              // appearActive: '',
              // appearDone: '',
              enter: 'animate__animated animate__bounce',
              enterActive: '',
              // enterDone: '',
              exit: '',
              exitActive: '',
              // exitDone: '',
            }}
            key={item.id}
            timeout={500}>
            {renderItem(item, index)}
          </CSSTransition>
        ))}
    </TransitionGroup>
  )
}

export default RollList
