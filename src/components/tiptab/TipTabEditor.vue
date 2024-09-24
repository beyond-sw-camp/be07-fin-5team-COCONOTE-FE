<template>
  <div v-if="editor" class="container">
    <div class="control-group">
      <div class="button-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          Bold
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          Italic
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          Strike
        </button>
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :disabled="!editor.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
        >
          Code
        </button>
        <button @click="editor.chain().focus().unsetAllMarks().run()">Clear marks</button>
        <button @click="editor.chain().focus().clearNodes().run()">Clear nodes</button>
        <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          Paragraph
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          H3
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          H4
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          H5
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          H6
        </button>
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          Bullet list
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          Ordered list
        </button>
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
        >
          Code block
        </button>
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          Blockquote
        </button>
        <button @click="editor.chain().focus().setHorizontalRule().run()">
          Horizontal rule
        </button>
        <button @click="editor.chain().focus().setHardBreak().run()">Hard break</button>
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
        >
          Undo
        </button>
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
        >
          Redo
        </button>
        <button
          @click="editor.chain().focus().setColor('#958DF1').run()"
          :class="{ 'is-active': editor.isActive('textStyle', { color: '#958DF1' }) }"
        >
          Purple
        </button>
      </div>
    </div>
    <div style="background-color: #ccc">
      <editor-content :editor="editor" />
    </div>
    <div style="width: 100%; margin-top: 30px">
      <pre style="white-space: break-spaces">{{ localHTML }}</pre>
    </div>
    <div style="width: 100%; margin-top: 30px">
      <pre style="white-space: break-spaces">{{ localJSON }}</pre>
    </div>
  </div>
</template>

<script>
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-3";
import CustomBlock from "@/components/tiptab/CustomBlock"; // CustomBlock 가져오기

import UniqueID from "@tiptap-pro/extension-unique-id";
import DragHandle from '@tiptap-pro/extension-drag-handle'
import NodeRange from '@tiptap-pro/extension-node-range'
// import DraggableItem from '@/components/tiptab/DraggableItem'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
      localJSON: "",
      localHTML: "",
    };
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({ types: [ListItem.name] }),
        StarterKit,
        CustomBlock,
        // DraggableItem
        UniqueID.configure({
          types: ["heading", "paragraph", "bulletList", "listItem"],
        }),
        NodeRange.configure({
          // allow to select only on depth 0
          // depth: 0,
          key: null,
        }),
        DragHandle.configure({
          render() {
            const element = document.createElement('div')

            element.classList.add('custom-drag-handle')

            return element
          },
        }),
      ],
      onUpdate: () => {
        this.localHTML = this.editor.getHTML();
        this.localJSON = this.editor.getJSON();
      },
      content: `
        <p data-id="2">zxc</p>
        <p data-id="2">aaaaaa</p>
        <ul data-id="2">
            <li data-id="1">
              <p data-id="sub-sub-1">Hi there</p>
            </li>
        </ul>
        <p data-id="2">
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
        </p>
        <h1 data-id="771">ggg</h1>
        <ul data-id="99999">
          <li data-id="22222">
            <p data-id="sub-1">That’s a bullet list with one …</p>
          </li>
          <li data-id="7777">
            <p data-id="sub-444">… or two list items.</p>
          </li>
        </ul>
        <ul data-id="414141">
          <li data-id="2120">
            <p data-id="sub-2">That’s a bullet list with one …</p>
          </li>
          <li data-id="41762">
            <p data-id="sub-3">… or two list items.</p>
          </li>
        </ul>
      `,
    });

    this.editor.on("beforeCreate", ({ editor }) => {
      // Before the view is created.
      console.log(`beforeCreate`, editor);
    });

    this.editor.on("create", ({ editor }) => {
      // The editor is ready.
      console.log(`create`, editor);
    });

    this.editor.on("update", ({ editor }) => {
      // The content has changed.
      console.log(`update`, editor);
    });

    this.editor.on("selectionUpdate", ({ editor }) => {
      // The selection has changed.
      console.log(`selectionUpdate`, editor);
      // this.editor.chain().focus().insertContent({
      //   type: 'customBlock',
      //   attrs: {
      //     id: `block-id-${Math.random().toString(36).substr(2, 9)}`  // 고유한 ID 생성
      //   },
      //   content: [
      //     {
      //       type: 'text',
      //       text: 'New custom block added with a unique block ID.'
      //     }
      //   ]
      // }).run();
    });

    this.editor.on("transaction", ({ editor, transaction }) => {
      // The editor state has changed.
      console.log(`transaction`, editor, transaction);
    });

    this.editor.on("focus", ({ editor, event }) => {
      // The editor is focused.
      console.log(`focus `, editor, event);
    });

    // this.editor.on('blur', ({ editor, event }) => {
    //   // The editor isn’t focused anymore.
    //   console.log(`blur `,editor,event)
    // })

    this.editor.on("destroy", () => {
      // The editor is being destroyed.
      console.log(`destroy`);
    });

    this.editor.on("contentError", ({ editor, error, disableCollaboration }) => {
      // The editor content does not match the schema.
      console.log(`contentError`, editor, error, disableCollaboration);
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: "JetBrainsMono", monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
  
}

::selection {
  background-color: #70CFF850;
}

.ProseMirror {
  padding: 1rem 1rem 1rem 0;

  * {
    margin-top: 0.75em;
  }

  > * {
    margin-left: 3rem;
  }

  .ProseMirror-widget * {
    margin-top: auto
  }

  ul,
  ol {
    padding: 0 1rem;
  }
}

.ProseMirror-noderangeselection {
  *::selection {
    background: transparent;
  }

  * {
    caret-color: transparent;
  }
}

.ProseMirror-selectednode,
.ProseMirror-selectednoderange {
  position: relative;

  &::before {
    position: absolute;
    pointer-events: none;
    z-index: -1;
    content: '';
    top: -0.25rem;
    left: -0.25rem;
    right: -0.25rem;
    bottom: -0.25rem;
    background-color: #70CFF850;
    border-radius: 0.2rem;
  }
}

.custom-drag-handle {
  &::after {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1.25rem;
    content: '⠿';
    font-weight: 700;
    cursor: grab;
    background:#0D0D0D10;
    color: #0D0D0D50;
    border-radius: 0.25rem;
  }
}
</style>
