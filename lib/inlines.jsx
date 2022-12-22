import React from 'react'
import { css } from '@emotion/css'
import { useSlate, useSelected } from 'slate-react'
import {
  Transforms,
  Editor,
  Range,
  Element as SlateElement
} from 'slate'
import { Button, Icon, Toolbar } from './slate-components'

const insertButton = editor => {
  if (editor.selection) {
    wrapButton(editor)
  }
}

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
  return !!link
}

const isButtonActive = editor => {
  const [button] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
  })
  return !!button
}

const unwrapButton = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'button',
  })
}

const wrapButton = editor => {
  if (isButtonActive(editor)) {
    unwrapButton(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const button = {
    type: 'button',
    tag: 'PERSON',
    children: isCollapsed ? [{ text: 'Edit me!' }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, button)
  } else {
    Transforms.wrapNodes(editor, button, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
      font-size: 0;
    `}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

export const EditableButtonComponent = ({ attributes, children, element }) => {
  const val = element.value;
  let color, border;

  switch (element.tag) {
    case "PERSON":
      color = "#f4e7ff";
      border = "#ce94ff";
      break;
    case "ORG":
    case "LEGAL_ORGANIZATION":
      color = "#e3ecff";
      border = "#a9c5ff";
      break;
    case "GPE":
      color = "#e3ecff";
      border = "#a9c5ff";
      break;
    case "LAW":
      color = "#f4e7ff";
      border = "#ce94ff";
      break;
    default:
      color = "#fff";
      border = "#fff";
      break;
  }

  return (
    /*
      Note that this is not a true button, but a span with button-like CSS.
      True buttons are display:inline-block, but Chrome and Safari
      have a bad bug with display:inline-block inside contenteditable:
      - https://bugs.webkit.org/show_bug.cgi?id=105898
      - https://bugs.chromium.org/p/chromium/issues/detail?id=1088403
      Worse, one cannot override the display property: https://github.com/w3c/csswg-drafts/issues/3226
      The only current workaround is to emulate the appearance of a display:inline button using CSS.
    */
    <span
      {...attributes}
      value={val}
      onClick={ev => ev.preventDefault()}
      // Margin is necessary to clearly show the cursor adjacent to the button
      className={css`
        margin: 0;
        background-color: #e7f5ff;
        padding: 1px 6px;
        border: 1px solid #74c0fc;
        font-size: 0.9em;
        line-height: 0.9;
      `}
      style={{
        backgroundColor: color,
        border: `1px solid ${border}`
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </span>
  )
}

export const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'link':
      return <LinkComponent {...props} />
    case 'button':
      return <EditableButtonComponent {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

export const Text = props => {
  const { attributes, children, leaf } = props
  return (
    <span
      // The following is a workaround for a Chromium bug where,
      // if you have an inline at the end of a block,
      // clicking the end of a block puts the cursor inside the inline
      // instead of inside the final {text: ''} node
      // https://github.com/ianstormtaylor/slate/issues/4704#issuecomment-1006696364
      className={
        leaf.text === ''
          ? css`
              padding-left: 0.1px;
            `
          : null
      }
      {...attributes}
    >
      {children}
    </span>
  )
}

export const ToggleEditableButtonButton = () => {
  const editor = useSlate()
  return (
    <Button
      active
      onMouseDown={event => {
        event.preventDefault()
        if (isButtonActive(editor)) {
          unwrapButton(editor)
        } else {
          insertButton(editor)
        }
      }}
    >
      <Icon><img src="../tag.svg" width={16} height={16} /></Icon>
      <span>Add Tags</span>
    </Button>
  )
}

export const onKeyDown = ({ event, editor }) => {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {

    const { nativeEvent } = event
    if (isKeyHotkey('left', nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset', reverse: true })
      return
    }
    if (isKeyHotkey('right', nativeEvent)) {
      event.preventDefault()
      Transforms.move(editor, { unit: 'offset' })
      return
    }
  }
}
