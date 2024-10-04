<template>
    <div class="channelInsideContainer">
      <ChannelCommonMenu :menu="'drive'" :channelId="channelId" />
      <h1>drive</h1>
    </div>
  </template>
    
    <script>
  import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";
  
  export default {
    props: {
      channelId: {
        type: String,
        required: true,
      },
    },
    components: {
      ChannelCommonMenu,
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
    
  