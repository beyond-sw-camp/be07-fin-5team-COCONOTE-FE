const types = {
  [Type.HEADING]: true,
}

export const BlockId = Node.create({
  name: 'blockId',

  addGlobalAttributes() {
    return [
      {
        types: Object.keys(types),
        attributes: {
          blockId: {
            default: null,
            rendered: false,
            keepOnSplit: false,
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (_transactions, oldState, newState) => {
          // no changes
          if (newState.doc === oldState.doc) {
            return
          }
          const tr = newState.tr

          newState.doc.descendants((node, pos, parent) => {
            if (
              node.isBlock &&
              parent === newState.doc &&
              !node.attrs.blockId &&
              types[node.type.name]
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                blockId: pushid(),
              })
            }
          })

          return tr
        },
      }),
    ]
  },
})