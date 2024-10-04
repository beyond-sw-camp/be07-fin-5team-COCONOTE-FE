<template>
  <v-navigation-drawer class="innerMenu" theme="dark" permanent rail>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="home"
        @click="changeSelectedMenu('home')"
        :class="{ 'selected-item': selectedMenu === 'home' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group"
        title="member"
        @click="changeSelectedMenu('member')"
        :class="{ 'selected-item': selectedMenu === 'member' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-magnify"
        title="search"
        @click="changeSelectedMenu('search')"
        :class="{ 'selected-item': selectedMenu === 'search' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <InnerRelatedMenuHome
    v-if="selectedMenu === 'home'"
    :selectedValue="selectedValue"
  />
  <InnerRelatedMenuMember
    v-if="selectedMenu === 'member'"
    :selectedValue="selectedValue"
  />
</template>


<script>
import axios from "axios";
import { mapGetters } from "vuex";

import InnerRelatedMenuHome from "@/components/basic/InnerRelatedMenuHome.vue";
import InnerRelatedMenuMember from "@/components/basic/InnerRelatedMenuMember.vue";

export default {
  props: {
    selectedValue: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters(["getWorkspaceId", "getWorkspaceName"]), // Vuex getter 매핑
  },
  name: "InnerMenu",
  components: {
    InnerRelatedMenuHome,
    InnerRelatedMenuMember,
  },

  data() {
    return {
      // 선택된 메뉴를 저장할 변수
      selectedMenu: "home", // 기본값으로 'home'을 선택
      selectedWorkspaceId: "",
    };
  },

  methods: {
    changeSelectedMenu(name) {
      this.selectedMenu = name;
      switch (this.selectedMenu) {
        case "home":
          this.locationHome()
          break;
        case "member":
          this.$router.push("/member");
          break;
        case "search":
          this.$router.push(`/workspace/${this.getWorkspaceId}/search`);
          break;
      }
    },
    async locationHome() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/${this.getWorkspaceId}/channel/first` // ⭐ 추후 API 수정
      );
      this.$router.push(`/channel/${response.data.result.channelId}`);
    },
  },
};
</script>

<style lang="scss">
.innerMenu {
  background: #32446e !important;
  position: static !important;
  height: 100% !important;

  .selected-item {
    background-color: #7280a2; /* 선택된 항목의 배경 색상 */
  }
}
</style>