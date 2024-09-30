<template>
  <v-app>
    <ChannelCommonMenu />
    <h1>canvas View Test</h1>
    <div>
      <CanvasListComponent />
      <CanvasDetailComponent />
    </div>
  </v-app>
</template>

<script>
import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";
import CanvasListComponent from "@/components/canvas/CanvasListComponent.vue";
import CanvasDetailComponent from "@/components/canvas/CanvasDetailComponent.vue";

export default {
  components: {
    ChannelCommonMenu,
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
