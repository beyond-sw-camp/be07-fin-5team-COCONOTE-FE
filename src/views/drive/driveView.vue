<template>
    <div class="channelInsideContainer">
      <ChannelCommonMenu :menu="'drive'"/>
      <FolderComponent :id="this.channelId"/>
    </div>
  </template>
    
    <script>
  import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";
  import FolderComponent from '@/components/drive/FolderComponent.vue';
  
  export default {
    props: {
      channelId: {
        type: String,
        required: true,
      },
    },
    components: {
      ChannelCommonMenu,
      FolderComponent
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
    
  