<template>
  <v-navigation-drawer permanent class="innerSubMenu" :width="220">
    <h1>코코노트 동아리</h1>
    <h1>{{ selectedValue }}</h1>
    <v-list>
      <v-list-item
        title="멤버"
        @click="selectedMenu = 'InnerRelated멤버MenuHome'"
        :class="{ 'selected-item': selectedMenu === '멤버' }"
        class="channel-item"
      ></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import axios from "axios";

export default {
    props: {
    selectedValue: {
      type: Number,
    }
  },
  name: "InnerRelatedMenuMember",
  components: {},
  updated() {
    this.fetchWorkspaceInfo();
  },
  data() {
    return {
      workspaceInfo: {},
      workspaceName: "",
    };
  },
  methods: {
    async fetchWorkspaceInfo() {
      try {
        const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODM0NTQ0LCJleHAiOjE3Mjg0MzkzNDR9.l3yDcj9uMg1iT_71PTeihdjUgp974t-Oz_ucZnmOQHF-i4d7la7X1MOY-WCNPaQx";
        
        const wsList = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/list`, {
          headers: {
            'Authorization': `Bearer ${token}` // 토큰을 헤더에 추가
          }
        });
        this.workspaceName = wsList.data.result[this.selectedValue -1].name;
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