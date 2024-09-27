<template>
  <v-navigation-drawer permanent class="innerSubMenu" :absolute="false">
    <h1>코코노트 동아리</h1>
    <v-list>
      <v-list-subheader class="section-title">
        <v-icon icon="mdi-menu-right" /> Group
      </v-list-subheader>
      <v-list-item
        title="공지채널"
        value="1"
        @click="goToThread('1', '공지채널')"
        :class="{ 'selected-item': selectedMenuId == '1' }"
        class="channel-item"
      ></v-list-item>

      <v-list-item
        title="채널2"
        value="2"
        @click="goToThread('2', '채널2')"
        :class="{ 'selected-item': selectedMenuId == '2' }"
      ></v-list-item>

      <v-list-item
        title="채널3"
        value="3"
        @click="goToThread('3', '채널3')"
        :class="{ 'selected-item': selectedMenuId == '3' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "InnerRelatedMenuHome",
  components: {},
  created() {
    this.selectedMenuId = this.$store.getters.getChannelId;
    this.selectedMenuId = this.selectedMenuId != null ? this.selectedMenuId : "l"; // 기본값으로 일단 1번 선택
    console.log("초기 채널 아이디 >> ", this.selectedMenuId);
  },
  data() {
    return {
      // 선택된 메뉴를 저장할 변수
      selectedMenuId: "1", // 기본값으로 일단 1번 선택
    };
  },
  methods: {
    ...mapActions(["setChannelInfoActions", "setChannelNameInfoActions"]),
    goToThread(channelValue, channelName) {
      console.log("@@@@@", channelValue, channelName);
      this.setChannelInfoActions(channelValue); // Vuex store에 업데이트
      this.setChannelNameInfoActions(channelName); // Vuex store에 업데이트
      this.selectedMenuId = channelValue;
      this.$router.push(`/channel/view/${channelValue}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>
