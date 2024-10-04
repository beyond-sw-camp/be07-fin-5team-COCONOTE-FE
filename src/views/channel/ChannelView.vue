<template>
  <div class="channelInsideContainer">
    <div class="channelInsideContentWrap">
      <h1>channel View Test</h1>
      <div>
        <h2>
          id : <span>{{ this.$store.getters.getChannelId }}</span>
        </h2>
        <v-btn>채널 참여</v-btn>
        <v-btn
          @click="
            this.$router.push(
              `/channel/${this.$store.getters.getChannelId}/thread/view`
            )
          "
          >쓰레드로 이동</v-btn
        >
        <v-btn
          @click="
            this.$router.push(
              `/channel/${this.$store.getters.getChannelId}/canvas/view`
            )
          "
          >캔버스로 이동</v-btn
        >
        <v-btn
          @click="
            this.$router.push(
              `/channel/${this.$store.getters.getChannelId}/drive/view`
            )
          "
          >드라이브로 이동</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {};
  },
  channelId(newVal) {
    if (newVal) {
      console.log("channelId가 설정되었습니다:!!", newVal);
      // 여기서 채널 상태가 설정된 이후 작업을 진행
    }
  },
  computed: {
    ...mapGetters(["getChannelId", "getChannelName"]), // Vuex getter 매핑
  },
  mounted() {
    if (!this.getChannelId) {
      console.log("없다...")
        // 처음 로딩 시점에 channelId가 없다면 로직 실행
    }else{
      this.checkMemberChannelJoin()
      
    }
  },
  methods: {
    async checkMemberChannelJoin(){
      axios
/api/v1/channel/{channelId}/isjoin
    }
  },
};
</script>
