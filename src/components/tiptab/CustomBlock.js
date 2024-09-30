import {  Node } from '@tiptap/core';

/**
 * CustomBlock allows you to create custom blocks with specific behavior.
 */
export const CustomBlock = Node.create({
  name: 'customBlock',

  group: 'block',

  // content: 'block+',
  content: 'inline*',

  // priority: 100,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

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

  // get plugins() {
  //   return [
  //     new Plugin({
  //       appendTransaction: (transactions, oldState, newState) => {
  //         const newTr = newState.tr
  //         let modified = false
          
  //         newState.doc.descendants((node, pos) => {
  //           if (!!node.type && (node.type.name === 'todo_item')) {
  //             const { blockId, ...rest} = node.attrs
  //             if (blockId === undefined || blockId === null || blockId === '') {
  //               // Adds a unique id to a node
  //               newTr.setNodeMarkup(pos, undefined, { blockId: `test`, ...rest })
  //               modified = true
  //             }
  //           }
  //         })
    
  //         if (modified) {
  //           return newTr
  //         }
  //       }
  //     })
  //   ]
  // },

  parseHTML() {
    console.log("Parsing HTML");
    return [
      { tag: 'div'},
      { tag: 'p'},
      { tag: 'ul'},
      { tag: 'li'},
      { tag: 'h1'},
      { tag: 'h2'},
      { tag: 'h3'},
      { tag: 'h4'},
      { tag: 'h5'},
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    console.log("Rendering HTML");

    const tag = node.attrs.tag || 'div'; // 여기서 tag 정보를 사용
    return [tag, HTMLAttributes, 0]; // 변경할 태그로 반영
  },

  // appendTransaction: (transactions, oldState, newState) => {
  //   console.error(transactions)
  //   console.error(oldState)
  //   console.error(newState)
  //   console.error("===================")
  //     if (newState.doc === oldState.doc) {
  //       // no changes
  //       return;
  //     }
  //     const tr = newState.tr;

  //     // Automatically assign ids to nodes that are:
  //     // - a direct child of the root document
  //     // - a direct child of a list (e.g.: <ul>, <ol>)

  //     // We can probably optimize this for performance
  //     newState.doc.descendants((node, pos, parent) => {
  //       if (node.isBlock && (parent === newState.doc || isList(parent))) {
  //         if (!node.attrs["block-id"]) {
  //           tr.setNodeMarkup(pos, undefined, {
  //             ...node.attrs,
  //             "block-id": uniqueId(),
  //           });
  //         }
  //       } else {
  //         // remove id
  //         if (node.attrs["block-id"]) {
  //           tr.setNodeMarkup(pos, undefined, {
  //             ...node.attrs,
  //             "block-id": undefined,
  //           });
  //         }
  //       }
  //     });
  //     return tr;
  //   },

  // addCommands() {
  //   return {
  //     setParagraph: () => ({ commands }) => {
  //       return commands.setNode(this.name);
  //     },
  //   };
  // },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Alt-0': () => this.editor.commands.setParagraph(),
  //   };
  // },
});

export default CustomBlock;