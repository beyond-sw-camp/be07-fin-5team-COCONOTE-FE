<template>
  <v-app>
    <h1>캔버스 테스트!!!</h1>
    <hr />
    <CanvasListComponent />
    <hr />
    <CanvasDetailComponent />
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
