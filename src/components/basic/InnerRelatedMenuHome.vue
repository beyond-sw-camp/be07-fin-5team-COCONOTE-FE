<template>
  <v-navigation-drawer permanent class="innerSubMenu" :absolute="false" >
    <h1>코코노트 동아리</h1>
    <h1>워크스페이스 이름 들어가야 함</h1>
      <v-icon>mdi-cog</v-icon>
    <v-list v-for="section in workspaceInfo" :key="section.sectionId">
      <v-list-subheader class="section-title">
        <v-icon icon="mdi-menu-right" />{{ section.sectionName }}
      </v-list-subheader>
      <v-list-item v-for="channel in section.channelList" :key="channel.channelId"
        :title= "channel.channelName"
        value="1"
        @click="goToThread('1', '공지채널')"
        :class="{ 'selected-item': selectedMenuId == '1' }"
        class="channel-item"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
    props: {
    selectedValue: {
      type: Number,
    }
  },
  name: "InnerRelatedMenuHome",
  components: {},
  created() {
    // this.selectedMenuId = this.$store.getters.getChannelId;
    // this.selectedMenuId = this.selectedMenuId != null ? this.selectedMenuId : "l"; // 기본값으로 일단 1번 선택
    // console.log("초기 채널 아이디 >> ", this.selectedMenuId);
    
  },
  updated() {
    this.fetchWorkspaceInfo();
  },
  data() {
    return {
      // 선택된 메뉴를 저장할 변수
      // selectedMenuId: "1", // 기본값으로 일단 1번 선택
      workspaceInfo: {},
    };
  },
  methods: {
    ...mapActions(["setChannelInfoActions", "setChannelNameInfoActions"]),
    goToThread(channelValue, channelName) {
      console.log("@@@@@", channelValue, channelName);
      this.setChannelInfoActions(channelValue); // Vuex store에 업데이트
      this.setChannelNameInfoActions(channelName); // Vuex store에 업데이트
      // this.selectedMenuId = channelValue;
      // this.$router.push(/channel/view/${channelValue});
    },
    async fetchWorkspaceInfo() {
      try {
        const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODM0NTQ0LCJleHAiOjE3Mjg0MzkzNDR9.l3yDcj9uMg1iT_71PTeihdjUgp974t-Oz_ucZnmOQHF-i4d7la7X1MOY-WCNPaQx";
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/detail/${this.selectedValue}`, {
          headers: {
            'Authorization': `Bearer ${token}` // 토큰을 헤더에 추가
          }
        });
        this.workspaceInfo = response.data.result; 
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>