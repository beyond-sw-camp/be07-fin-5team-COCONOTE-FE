<template>
  <v-app-bar :elevation="2" class="topMenu" height="40">
    <v-app-bar-title class="title"> COCONOTE </v-app-bar-title>
    <template v-slot:append>
      <!-- <v-select
        v-model="selectedValue"
        :items="items"
        item-title="name"
        item-value="workspaceId"
        @change="emitSelected"
        outlined
        single-line
        hide-details
        dense
        class="inline"
        style="font-size:0.9rem"
      ></v-select> -->


        <v-form @submit.prevent="emitSelected">
          <v-row>
            <v-col cols="auto">
              <v-select
                v-model="selectedValue"
        :items="items"
        item-title="name"
        item-value="workspaceId"
        outlined
        single-line
        hide-details
        dense
        class="inline"
        style="font-size:0.9rem"
      ></v-select>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit">이동</v-btn>
            </v-col>
          </v-row>
        </v-form>





    </template>
  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  name: "CommonTopMenu",
  components: {
  },
  data() {
    return {
      items: [],
      selectedValue: null,
    };
  },
  created() {
    this.fetchMyWorkspaceList();
  },
  methods: {
    async fetchMyWorkspaceList() {
      try {
        const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODI5MzQxLCJleHAiOjE3Mjg0MzQxNDF9.6xC5fA7Lfq_9Ba9ZW8aigljUAnOwMut4N2iVS2KpOQtnc9KzS03dJdb1RrR56sTh";
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/workspace/list`, {
          headers: {
            'Authorization': `Bearer ${token}` // 토큰을 헤더에 추가
          }
        });
        this.items = response.data.result; // 내 워크스페이스 목록 가져오기
        console.log(response.data.result);
      } catch (e) {
        console.log(e);
      }
    },
    emitSelected() {
      this.$emit('selected', this.selectedValue);
    }
  }
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
  .v-select *{
    font-size: 0.8rem;
  }
}
</style>
