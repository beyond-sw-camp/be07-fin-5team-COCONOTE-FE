<template>
  <v-navigation-drawer permanent class="innerSubMenu" :width="220">
    <div>{{ workspaceName }} 회원 목록</div>
    <v-list v-for="member in workspaceMemberList" :key="member.workspaceMemberId">
      <v-list-item 
        value="member.workspaceMemberId"
        @click="selectedMenu = 'InnerRelated멤버MenuHome'"
        :class="{ 'selected-item': selectedMenu === '멤버' }"
        class="channel-item"
      >
      <template v-slot:prepend>
        <v-icon>mdi-person</v-icon>
        <span>{{ member.nickname }}</span>
      </template>
      </v-list-item>
        <v-list-item>
        <template v-slot:prepend>
          <v-btn @click="showMailSender">
          </v-btn>
        <span>회원 초대</span>
      </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <CreateWorkspaceMemberModal 
    v-model = "sendMail"
    @update:dialog="sendMail = $event"
    :selectedValue="selectedValue" 
  />
</template>

<script>
import axios from "axios";
import CreateWorkspaceMemberModal from '@/components/basic/CreateWorkspaceMemberModal.vue';

export default {
    props: {
    selectedValue: {
      type: Number,
    }
  },
  name: "InnerRelatedMenuHome",
  components: {
    CreateWorkspaceMemberModal
  },
  updated() {
    this.fetchWorkspaceInfo();
  },
  data() {
    return {
      workspaceMemberList: {},
      workspaceName: "",
      sendMail:false,
      
    };
  },
  methods: {
    async fetchWorkspaceInfo() {
      try {
        const wsList = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/list`);
        this.workspaceName = wsList.data.result[this.selectedValue -1].name;
        const wsDetail = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/${this.selectedValue}/member/list`);
        this.workspaceMemberList = wsDetail.data.result; 
      } catch (e) {
        console.log(e);
      }
    },
    showMailSender() {
      this.sendMail = true;
      console.log(this.sendMail);
    }
  },
};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>