<template>
  <v-navigation-drawer permanent class="innerSubMenu" :absolute="false">
    <h1>{{ this.getWorkspaceName }}</h1>
    <v-list>
      <template v-for="section in sections" :key="section.sectionId">
        <v-list-subheader class="section-title">
          <v-icon icon="mdi-menu-right" /> {{ section.sectionName }}
        </v-list-subheader>

        <v-list-item
          v-for="channel in section.channelList"
          :key="channel.channelId"
          :class="{ 'selected-item': selectedMenuId == channel.channelId }"
          class="channel-item"
          @click="changeChannel(channel.channelId)"
        >
          <template v-slot:prepend>
            <v-icon v-if="isPublic" icon="mdi-lock"></v-icon>
            <v-icon v-else icon="mdi-apple-keyboard-command"></v-icon>
          </template>

          <v-list-item-title> {{ channel.channelName }}</v-list-item-title>
        </v-list-item>

        <v-list-item> 채널생성 </v-list-item>
      </template>

      <v-list-subheader class="section-title">
        <v-icon icon="mdi-menu-right" /> 섹션 생성
      </v-list-subheader>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "InnerRelatedMenuHome",
  components: {},
  computed: {
    ...mapGetters(["getWorkspaceId", "getWorkspaceName"]), // Vuex getter 매핑
  },
  watch: {
    // 라우터 파라미터 channelId의 변화를 감지
    "$route.params.channelId": {
      // immediate: true, // 처음 로딩 시에도 호출

      handler(newChannelId) {
        console.error(newChannelId);
        this.selectedChannelMenuId = newChannelId;
        this.changeChannel(newChannelId);
      },
    },
  },
  mounted() {
    this.getSectionData();
    this.selectedChannelMenuId = this.$route.params.channelId; //이 변수에서 routerId값이 변경된 것을 감지해서 항상 바뀌었으면 좋겠어
  },
  data() {
    return {
      sections: [],
      selectedChannelMenuId: null,
    };
  },
  methods: {
    async getSectionData() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/section/list/${this.getWorkspaceId}`
      );
      console.log(response);
      this.sections = response.data.result;
    },
    changeChannel(id) {
      this.selectedMenuId = id;
      this.$router.push(`/channel/view/${id}`);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>
