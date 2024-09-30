<template>
  <div>
    <h1>canvas Detail Test</h1>
    <CanvasDetailComponent />
    <h1>Tiptap</h1>
    <div>
      

      <div class="output-group">
        <label>Content</label>
        <code>{{ content }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import CanvasDetailComponent from "@/components/canvas/CanvasDetailComponent.vue";

export default {
  components: {
    CanvasDetailComponent,
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
