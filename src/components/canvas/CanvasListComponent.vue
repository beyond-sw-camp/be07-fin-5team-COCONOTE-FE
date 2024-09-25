<template>
  <div class="container" v-cloak>
    <div class="row">
      <div class="col-md-12">
        <h3>채팅방 리스트</h3>
      </div>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">방제목</label>
      </div>
      <input
        type="text"
        class="form-control"
        v-model="canvasName"
        @keyup.enter="createRoom"
      />
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="createRoom">
          채팅방 개설
        </button>
      </div>
    </div>
    <ul class="list-group">
      <li
        class="list-group-item list-group-item-action"
        v-for="item in chatrooms"
        :key="item.id"
        @click="enterRoom(item.id)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
// import VueRouter from "vue-router"; // Vue 2에서는 router를 따로 불러와서 사용해야 함

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
        .get(`${process.env.VUE_APP_API_BASE_URL}/canvas/${this.channelId}/list`)
        .then((response) => {
          this.chatrooms = response.data.result.content;
        });
    },
    createRoom() {
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
    enterRoom(canvasId) {
      const sender = prompt("대화명을 입력해 주세요.");
      if (sender) {
        localStorage.setItem("wschat.sender", sender);
        localStorage.setItem("wschat.canvasId", canvasId);
        this.$router.push(`/canvas/detail`);
      }
    },
  },
  mounted() {
    this.findAllRoom();
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
