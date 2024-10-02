<template>
  <v-app-bar :elevation="2" class="topMenu" height="40">
    <v-app-bar-title class="title"> COCONOTE </v-app-bar-title>
    <template v-slot:append>
        <v-row>
          <v-col cols="auto" v-if="isLoading == true">
            <v-select
              v-model="workspaceId"
              :items="items"
              outlined
              single-line
              hide-details
              dense
              class="inline"
              style="font-size: 0.9rem"
            ></v-select>
          </v-col>
        </v-row>
    </template>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['getWorkspaceId', 'getWorkspaceName']) // Vuex getter 매핑
  },
  name: "CommonTopMenu",
  components: {},
  data() {
    return {
      items: [],
      selectedValue: null,
      isLoading : false,
    };
  },
  created() {
    this.selectedValue = this.$store.getters.getWorkspaceId;
    console.log("selectedValue >> ", this.selectedValue)
    this.fetchMyWorkspaceList();
  },
  methods: {
    async fetchMyWorkspaceList() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/workspace/list`
        );
        this.items = response.data.result; // 내 워크스페이스 목록 가져오기

        console.log(response.data.result);


        this.isLoading = true;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
.topMenu {
  &.v-toolbar {
    background-color: #383f4a !important;
    * {
      color: #fff;
    }
  }
  .title {
    font-size: 0.9rem; /* v-app-bar-title의 폰트 크기 설정 */
  }
  .v-select * {
    font-size: 0.8rem;
  }
}
</style>
