<template>
  <div class="channelInsideContainer">
    <ChannelCommonMenu />
    <div class="channelInsideContentWrap">
      <ThreadComponent :id="this.id"/>
    </div>
  </div>
</template>
  
  <script>
import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";
import ThreadComponent from "@/components/thread/ThreadComponent.vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    ChannelCommonMenu,
    ThreadComponent,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  updated() {},
  beforeUnmount() {},
  computed: {},
  methods: {},
};
</script>
  
