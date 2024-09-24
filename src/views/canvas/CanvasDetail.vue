<template>
  <div>
    <h1>canvas Detail Test</h1>
    <CanvasDetailComponent />
    <h1>Tiptap</h1>
    <div>
      <TipTabEditor v-model="content" />

      <div class="output-group">
        <label>Content</label>
        <code>{{ content }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import CanvasDetailComponent from "@/components/canvas/CanvasDetailComponent.vue";
import TipTabEditor from '@/components/tiptab/TipTabEditor.vue'

export default {
  components: {
    CanvasDetailComponent,
    TipTabEditor
  },
  data() {
    return {
      content: '<p>A Vue.js wrapper component for Tiptap to use <code>v-model</code>.</p>',
    };
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
