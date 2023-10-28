import { CompetitionType } from '@/type'
import React, { Fragment, useEffect, useState } from 'react'

const CompetitionTypeLabel: React.FC<{
  type: CompetitionType
  className: string
  showLabel?: boolean
}> = props => {
  const { className, showLabel } = props
  const [show, setshow] = useState<boolean>()

  useEffect(() => {
    showLabel === false ? setshow(false) : setshow(true)
  }, [showLabel])
  return (
    <div className="flex items-center">
      {props.type === 'Single' && (
        <Fragment>
          <svg className={className}>
            <use href="#icon-wode"></use>
          </svg>
          {show && <div>个人赛</div>}
        </Fragment>
      )}
      {props.type === 'Group' && (
        <Fragment>
          <svg className={className}>
            <use href="#icon-xiaozu"></use>
          </svg>
          {show && <div>小组赛</div>}
        </Fragment>
      )}
      {props.type === 'Match' && (
        <Fragment>
          <svg className={className}>
            <use href="#icon-pipei"></use>
          </svg>
          {show && <div>匹配赛</div>}
        </Fragment>
      )}
      {props.type === 'OI' && (
        <Fragment>
          <svg className={className}>
            <use href="#icon-pipei"></use>
          </svg>
          {show && <div>OI赛</div>}
        </Fragment>
      )}
    </div>
  )
}

export default CompetitionTypeLabel
