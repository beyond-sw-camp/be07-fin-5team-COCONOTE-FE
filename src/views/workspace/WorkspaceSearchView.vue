<template>
  <v-dialog v-model="dialog" width="auto" persistent>
    <v-card
      max-width="400"
      text="입장하고자 하는 워크스페이스의 정보가 존재하지 않습니다."
      title="워크스페이스 없음"
    >
      <template v-slot:actions>
        <v-btn class="ms-auto" text="확인" @click="locationToHomeRouter"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      workspaceId: null,
      dialog: false,
    };
  },
  computed: {},
  created() {
    this.getMyFirstWorkspace();
  },
  methods: {
    ...mapActions(["setWorkspaceInfoActions", "setWorkspaceNameInfoActions"]),
    async getMyFirstWorkspace() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/workspace/first`
      );
      console.log(response);
      if (!response.data.result) {
        // 해당 유저의 workspace가 존재하지 않을 때
        this.dialog = true;
        return false;
      }
      const firstData = response.data.result;
      this.workspaceId = firstData.workspaceId
      this.setWorkspaceInfoActions(firstData.workspaceId); // Vuex store에 업데이트
      this.setWorkspaceNameInfoActions(firstData.name); // Vuex store에 업데이트
      this.getMyFirstChannelInWorkspace();
    },
    async getMyFirstChannelInWorkspace() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/${this.workspaceId}/channel/first` // ⭐ 추후 API 수정
      );

      this.$router.push(`/channel/view/${response.data.result.channelId}`);
    },
    locationToHomeRouter() {
      this.$router.push(`/`);
    },
  },
};
</script>
