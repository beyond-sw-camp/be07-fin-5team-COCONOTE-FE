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
        const wsList = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/list`);
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