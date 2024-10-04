<template>
  <v-navigation-drawer permanent class="innerSubMenu" :absolute="false">
    <h1>{{ this.getWorkspaceName }}</h1>
    <v-list>
      <template v-for="section in sections" :key="section.sectionId">
        <v-list-subheader class="section-title">
          <v-icon icon="mdi-menu-right" />
          {{ section.sectionName }}
          <!-- 관리자일 때만 표시 -->
          <v-icon class="icon-cog" icon="mdi-cog" />
        </v-list-subheader>

        <v-list-item
          v-for="channel in section.channelList"
          :key="channel.channelId"
          :class="{ 'selected-item': selectedChannelMenuId == channel.channelId }"
          class="channel-item"
          @click="changeChannel(channel.channelId, channel.channelName)"
        >
          <template v-slot:prepend>
            <v-icon v-if="!channel.isPublic" icon="mdi-lock"></v-icon>
            <v-icon v-else icon="mdi-apple-keyboard-command"></v-icon>
          </template>

          <v-list-item-title> {{ channel.channelName }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          class="channelCreate"
          @click="
            (channelDialog = true),
              (createChannelInfo.sectionId = section.sectionId)
          "
        >
          <v-icon class="icon-plus" icon="mdi-plus" />
          채널생성
        </v-list-item>
      </template>

      <v-list-subheader
        class="section-title sectionCreate"
        @click="sectionDialog = true"
      >
        <v-icon class="icon-plus" icon="mdi-plus" /> 섹션 생성
      </v-list-subheader>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="channelDialog" width="auto" class="channelDialog">
    <v-card max-width="400">
      <v-card-title> 채널 관리 </v-card-title>
      <v-card-text>
        <p>채널의 이름을 입력하세요.</p>
        <v-text-field
          ref="channelNameInput"
          color="primary"
          density="compact"
          variant="underlined"
          v-model="createChannelInfo.channelName"
          @keyup.enter="createChannel"
          placeholder="이름"
        ></v-text-field>
        <p>채널의 설명을 입력하세요.</p>
        <v-text-field
          color="primary"
          density="compact"
          variant="underlined"
          v-model="createChannelInfo.channelInfo"
          @keyup.enter="createChannel"
          placeholder="이름"
        ></v-text-field>
        <v-radio-group
          inline
          label="채널종류"
          v-model="createChannelInfo.isPublic"
        >
          <v-radio label="공개채널" value="1"></v-radio>
          <v-radio label="비공개 채널" value="0"></v-radio>
        </v-radio-group>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="" text="생성" @click="createChannel"></v-btn>
        <v-btn class="" text="닫기" @click="channelDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="sectionDialog" width="auto" class="sectionDialog">
    <v-card max-width="400">
      <v-card-title> 섹션 관리 </v-card-title>
      <v-card-text>
        섹션의 이름을 입력하세요.
        <v-text-field
          color="primary"
          density="compact"
          class="canvasTitle"
          variant="underlined"
          v-model="createSectionName"
          @keyup.enter="createSection"
          placeholder="이름"
        ></v-text-field>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="" text="생성" @click="createSection"></v-btn>
        <v-btn class="" text="닫기" @click="sectionDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

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
  created() {
    this.selectedChannelMenuId = this.$route.params.channelId;
  },
  mounted() {
    this.getSectionData();
    this.selectedChannelMenuId = this.$route.params.channelId; //이 변수에서 routerId값이 변경된 것을 감지해서 항상 바뀌었으면 좋겠어
  },
  data() {
    return {
      sections: [],
      selectedMenuId : null,
      selectedChannelMenuId: null,
      sectionDialog: false,
      channelDialog: false,
      createSectionName: "",
      createChannelInfo: {
        sectionId: null,
        channelName: "",
        channelInfo: "",
        isPublic: 1,
      },
    };
  },
  methods: {
    ...mapActions(["setChannelInfoActions", "setChannelNameInfoActions"]),
    async getSectionData() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/section/list/${this.getWorkspaceId}`
      );
      console.log(response);
      this.sections = response.data.result;
    },
    async changeChannel(id,name) {
      this.selectedChannelMenuId = id;
      // window.location.href = `/channel/${id}`;
      this.setChannelInfoActions(id); // Vuex store에 업데이트
      this.setChannelNameInfoActions(name); // Vuex store에 업데이트

      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/channel/${this.$store.getters.getChannelId}/isjoin`
      );

      const isJoin = response.data.result;

      if(isJoin){
        this.$router.push(`/channel/${id}/thread/view`);
      }else{
        this.$router.push(`/channel/${id}`);
      }
    },
    async createSection() {
      try {
        const data = {
          workspaceId: this.getWorkspaceId,
          sectionName: this.createSectionName,
        };
        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/section/create`,
          data
        );
        this.getSectionData();
      } catch (error) {
        console.log(error);
      }
    },
    async createChannel() {
      const data = {
        sectionId: this.createChannelInfo.sectionId,
        channelName: this.createChannelInfo.channelName,
        channelInfo: this.createChannelInfo.channelInfo,
        isPublic: Number(this.createChannelInfo.isPublic),
      };
      if (data.channelName == "") {
        alert("channel 이름은 반드시 입력해주세요.");
        this.$refs.channelNameInput.focus();
        return false;
      }
      try {
        await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/channel/create`,
          data
        );
        this.getSectionData();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>

<style lang="scss">
.section-title {
  &.sectionCreate &.v-list-subheader {
    cursor: pointer;
    background-color: #2f3653;
    padding: 4px !important;
    border-radius: 8px;
    min-height: auto !important;
    &:hover {
      background-color: #6c759c;
    }
  }
  .icon-cog {
    font-size: 0.8rem;
    opacity: 0.5;
  }
}
.channelCreate {
  font-size: 0.9rem;
  background-color: #3c4670;
}
</style>
