<template>
  <div class="channelInsideContainer">
    <div class="channelInsideContentWrap">
      <h1>channel View Test</h1>
      <div>
        <h2>
          id : <span>{{ this.$store.getters.getChannelId }}</span>
        </h2>
        <v-btn>채널 참여</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.$store.getters.getChannelId}/thread/view`)">쓰레드로 이동</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.$store.getters.getChannelId}/canvas/view`)">캔버스로 이동</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.$store.getters.getChannelId}/drive`)">드라이브로 이동</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  components: {},
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters(['getChannelId', 'getChannelName']) // Vuex getter 매핑
  },
  created() {
    
  },
  methods: {},
};
</script>
