import React, { Fragment, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

interface Iprops {
  value?: Descendant[]
  text?: string[]
  className?: string
  title?: string
  editableClassName?: string
}

const ReadOnly: React.FC<Iprops> = props => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const renderElement = React.useCallback(
    (props: any) => <Element {...props} />,
    []
  )
  return (
    <Fragment>
      {props.title && <div className="font-bold text-base">{props.title}</div>}
      <div className={props.className}>
        <Slate
          editor={editor}
          value={
            props.value
              ? props.value
              : (props.text?.map((value: any, index: number) => {
                  return {
                    type: 'paragraph',
                    children: [
                      {
                        text: value
                      }
                    ]
                  }
                }) as Descendant[])
          }
        >
          <Editable
            className={`${props.editableClassName}`}
            renderElement={renderElement}
            readOnly
          />
        </Slate>
      </div>
    </Fragment>
  )
}

export default ReadOnly

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}
