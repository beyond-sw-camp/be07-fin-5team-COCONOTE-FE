<template>
  <v-app>
    <h1>channel View Test</h1>
    <div>
      <h2>id : <span>{{ channelId }}</span></h2>
      <h4>해당 위치에서, channel 에 연결된 회원인지 검증</h4>
      <p>연결이 되어있다면? router로 바로 쓰레드 주소로 이동</p>
      <p>
        연결이 안된 회원이라면? 하단 버튼으로 채널에 입장하도록 하고 쓰레드 주소로 이동
      </p>
      <v-btn>채널 참여</v-btn>
    </div>
  </v-app>
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
  watch: {
    channelId(newVal) {
      console.log("channelId가 변경되었습니다: ", newVal);
      // 여기서 추가로 채널 입장 여부를 검증하는 로직을 추가할 수 있음
    },
  },
  created() {
    this.channelId = this.$store.getters.getChannelId;
    this.channelId = this.channelId != null ? this.channelId : "l"; // 기본값으로 일단 1번 선택 (실제 개발에는 변경해야함)
    console.log("초기 채널 아이디 >> ", this.channelId);
  },
  methods: {},
};
</script>
