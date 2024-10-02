<template>
  <v-app class="app global_bg">
    <!-- <v-row no-gutters>
      <v-col cols="12">
        <v-sheet class="pa-2">
          .v-col-12
        </v-sheet>
      </v-col>
      <v-col cols="2">
        <v-sheet class="pa-2 ma-2">
          .v-col-2
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
    </v-row> -->

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
        const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODM0NTQ0LCJleHAiOjE3Mjg0MzkzNDR9.l3yDcj9uMg1iT_71PTeihdjUgp974t-Oz_ucZnmOQHF-i4d7la7X1MOY-WCNPaQx";
        console.log("ok 1");
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/detail/${value}`, {
          headers: {
            'Authorization': `Bearer ${token}` // 토큰을 헤더에 추가
          }
        });
        console.log("ok 2");
        console.log(response.data.result);
        console.log("ok 3");
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