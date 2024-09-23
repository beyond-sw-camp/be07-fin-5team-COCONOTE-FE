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
        v-model="room_name"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "CanvasListComponent",
  data() {
    return {
      channelId: 1,
    };
  },
  setup() {
    const room_name = ref("");
    const channelId = ref(1);
    const chatrooms = ref([]);
    const router = useRouter();

    const findAllRoom = () => {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/canvas/${channelId.value}/list`)
        .then((response) => {
          chatrooms.value = response.data.result.content;
        });
    };

    const createRoom = () => {
      if (room_name.value === "") {
        alert("방 제목을 입력해 주십시요.");
        return;
      } else {
        // const params = new URLSearchParams();
        // params.append("name", room_name.value);
        const params = {
          title: room_name.value,
          parentCanvasId: null,
          channelId: 1,
        };
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/canvas/create`, params)
          .then((response) => {
            alert(response.data.title + "방 개설에 성공하였습니다.");
            room_name.value = "";
            findAllRoom();
          })
          .catch(() => {
            alert("채팅방 개설에 실패하였습니다.");
          });
      }
    };

    const enterRoom = (roomId) => {
      const sender = prompt("대화명을 입력해 주세요.");
      if (sender) {
        localStorage.setItem("wschat.sender", sender);
        localStorage.setItem("wschat.roomId", roomId);
        router.push(`/canvas/detail`);
        // router.push(`/canvas/detail/${roomId}`);
      }
    };

    onMounted(() => {
      findAllRoom();
    });

    return {
      room_name,
      chatrooms,
      createRoom,
      enterRoom,
    };
  },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
