import { Node } from '@tiptap/core'

const CustomBlock = Node.create({
  name: 'customBlock',

  // group: 'block', // 'block'으로 설정해 블록 요소로 처리

  content: 'block+',  // 자식 태그가 블록일 경우 처리. 'inline*'로 바꿀 수도 있음

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          return { 'data-id': attributes.id || `block-id-${Math.random().toString(36).substr(2, 9)}` }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'ul', // ul 태그에서 data-id가 있는 경우
      },
      {
        tag: 'div[data-id]', // div 태그에서 data-id가 있는 경우
      },
      
      {
        tag: 'li', // li 태그에서 data-id가 있는 경우
      },
      {
        tag: 'p', // p 태그에서 data-id가 있는 경우
      },
    ]
  },

  renderHTML({ node, HTMLAttributes, test }) {
    // 각 노드의 tag를 유지하며, data-id 속성을 포함하여 렌더링
    console.error(node, node.attrs)
    const tag = node.attrs.tag || 'div'; // 기본값으로 div 사용
    return [tag, HTMLAttributes, 0]; // 0은 자식 요소들을 그대로 유지
  },
})

export default CustomBlock
