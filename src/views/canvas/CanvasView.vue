<template>
  <v-app>
    
    <h1>canvas View Test</h1>
    <div>
      <CanvasListComponent />
      <CanvasDetailComponent />
    </div>
  </v-app>
</template>

<script>
import CanvasListComponent from "@/components/canvas/CanvasListComponent.vue";
import CanvasDetailComponent from "@/components/canvas/CanvasDetailComponent.vue";

export default {
  components: {
    CanvasListComponent,
    CanvasDetailComponent,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>
