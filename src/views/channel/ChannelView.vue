<template>
  <div class="channelInsideContainer">
    <div class="channelInsideContentWrap">
      <h1>channel View Test</h1>
      <div>
        <h2>
          id : <span>{{ channelId }}</span>
        </h2>
        <h4>해당 위치에서, channel 에 연결된 회원인지 검증</h4>
        <p>연결이 되어있다면? router로 바로 쓰레드 주소로 이동</p>
        <p>
          연결이 안된 회원이라면? 하단 버튼으로 채널에 입장하도록 하고 쓰레드 주소로 이동
        </p>
        <v-btn>채널 참여</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.channelId}/thread/view`)">쓰레드로 이동</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.channelId}/canvas/view`)">캔버스로 이동</v-btn>
        <v-btn @click="this.$router.push(`/channel/${this.channelId}/drive`)">드라이브로 이동</v-btn>
      </div>

      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>channel View Test</h1>
      <h1>마지막줄</h1>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      channelId: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.channelId = this.$route.params.channelId;
  },
  methods: {},
};
</script>
