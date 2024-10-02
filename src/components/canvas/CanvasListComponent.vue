<template>
  <v-list class="h-100">
    <v-list-item
      prepend-icon="mdi-note-text-outline"
      v-for="item in chatrooms"
      :key="item.id"
      @click="changeCanvasId(item.id)"
    >
      {{ item.title }}
    </v-list-item>
    <v-list-item class="list-create">
      <v-text-field
        color="primary"
        density="compact"
        class="form-control"
        variant="underlined"
        v-model="canvasName"
        @keyup.enter="createCanvas"
      ></v-text-field>
    </v-list-item>
  </v-list>
  <div class="container" v-cloak>
    <!-- <div class="row">
      <div class="col-md-12">
        <h3>채팅방 리스트</h3>
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">방제목</label>
      </div>
      <div class="input-group-append">
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
// import { useRouter } from "vue-router";

export default {
  name: "CanvasListComponent",

  data() {
    return {
      canvasName: "",
      channelId: 1,
      chatrooms: [],
    };
  },
  methods: {
    findAllRoom() {
      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/canvas/${this.channelId}/list`
        )
        .then((response) => {
          this.chatrooms = response.data.result.content;
        });
    },
    createCanvas() {
      if (this.canvasName === "") {
        alert("캔버스 제목을 입력해 주십시요.");
        return;
      } else {
        const params = {
          title: this.canvasName,
          parentCanvasId: null,
          channelId: 1,
        };
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/canvas/create`, params)
          .then((response) => {
            alert(response.data.title + "방 개설에 성공하였습니다.");
            this.canvasName = "";
            this.findAllRoom();
          })
          .catch(() => {
            alert("채팅방 개설에 실패하였습니다.");
          });
      }
    },
    changeCanvasId(canvasId) {
      const sender = prompt("대화명을 입력해 주세요.");
      if (sender) {
        localStorage.setItem("wschat.sender", sender);
        localStorage.setItem("wschat.roomId", canvasId);
        this.$emit("updateCanvasId", canvasId);
      }
    },
  },

  created() {
    this.findAllRoom();
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
