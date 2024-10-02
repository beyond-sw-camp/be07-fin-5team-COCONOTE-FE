<template>
  <v-app-bar :elevation="2" class="topMenu" height="40">
    <v-app-bar-title class="title"> COCONOTE </v-app-bar-title>
    <template v-slot:append>
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
            <v-col cols="auto">
              <v-btn icon @click="showWorkspaceModal">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>


    </template>
  </v-app-bar>
            <CreateWorkspaceModal 
        v-model = "createWorkspace"
        @update:dialog="createWorkspace = $event"
        >
          </CreateWorkspaceModal>
</template>

<script>
import axios from "axios";
import CreateWorkspaceModal from '@/components/createSpaces/CreateWorkspaceModal.vue';

export default {
  name: "CommonTopMenu",
  components: {
    CreateWorkspaceModal
  },
  data() {
    return {
      items: [],
      selectedValue: null,
      createWorkspace:false,
    };
  },
  created() {
    this.fetchMyWorkspaceList();
  },
  methods: {
    async fetchMyWorkspaceList() {
      try {
        const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODM0NTQ0LCJleHAiOjE3Mjg0MzkzNDR9.l3yDcj9uMg1iT_71PTeihdjUgp974t-Oz_ucZnmOQHF-i4d7la7X1MOY-WCNPaQx";
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
    },
          showWorkspaceModal() {
            this.createWorkspace = true;
            console.log(this.createWorkspace);
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
