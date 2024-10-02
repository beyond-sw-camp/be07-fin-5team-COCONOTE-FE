<template>
  <v-app class="app global_bg">
    <v-sheet>
      <v-row no-gutters>
        <v-col cols="12" class="CommonTopContainer">
          <CommonTopMenu @selected="handleSelected" />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2">
          <div class="d-flex innerMenuContainer">
            <InnerMenu :selectedValue="selectedValue" />
          </div>
        </v-col>
        <v-col>
          <v-sheet class="main-content">
            <router-view />
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
  </v-app>
</template>

<script>
import CommonTopMenu from "@/components/basic/CommonTopMenu.vue";
import InnerMenu from "@/components/basic/InnerMenu.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    CommonTopMenu,
    InnerMenu,
  },
  data() {
    return {
      selectedValue: null,
      workspaceInfo: [],
    };
  },
   methods: {
    handleSelected(value) {
      this.selectedValue = value;
      this.sendToServer(value);
    },
    async sendToServer(value) {
      try{
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/detail/${value}`);
        console.log(response.data.result);
        // this.workspaceInfo = response.data.result;
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss">

.CommonTopContainer {
  height: 40px;
}
.innerMenuContainer {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  height: 100%;
  > * {
    padding: 0 !important;
  }
}
.main-content{
  height: calc(100% - 40px);
}
</style>