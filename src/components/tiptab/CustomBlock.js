// /components/tiptap/CustomBlock.js

import { Node } from '@tiptap/core'

const CustomBlock = Node.create({
  name: 'customBlock',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          return { 'data-id': attributes.id }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-id]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },
})

export default CustomBlock
