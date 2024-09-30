<template>
  <div class="container">
    <div>
      <h2>{{ room.title }}</h2>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <label class="input-group-text">내용</label>
      </div>
      <input
        type="text"
        class="form-control"
        v-model="message"
        @keypress.enter="sendMessage"
      />
      <div class="input-group-append">
        <button class="btn btn-primary" type="button" @click="sendMessage">보내기</button>
      </div>
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="message in messages" :key="message.timestamp">
        {{ message.sender }} - {{ message.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default {
  name: "CanvasDetailComponent",
  data() {
    return {
      roomId: "",
      room: {},
      sender: "",
      message: "",
      messages: [],
      ws: null,
      sock: null,
      reconnect: 0,
    };
  },
  mounted() {
    this.roomId = localStorage.getItem("wschat.roomId");
    this.sender = localStorage.getItem("wschat.sender");
    this.findRoom();
    this.connect();
  },
  methods: {
    findRoom() {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/canvas/${this.roomId}`)
        .then((response) => {
          this.room = response.data.result;
        });
    },
    sendMessage() {
      if (this.ws && this.ws.connected) {
        console.log("Sending message:", {
          type: "TALK",
          roomId: this.roomId,
          sender: this.sender,
          message: this.message,
        });

        this.ws.send(
          `/pub/canvas/message`,
          {},
          JSON.stringify({
            type: "TALK",
            roomId: this.roomId,
            sender: this.sender,
            message: this.message,
          })
        );
        this.message = "";
      } else {
        console.log("WebSocket is not connected.");
      }
    },
    recvMessage(recv) {
      console.log("@@@@@@@@@@@@@ >> ", recv);
      this.messages.unshift({
        type: recv.type,
        sender: recv.type === "ENTER" ? "[알림]" : recv.sender,
        message: recv.message,
      });
    },
    connect() {
      // this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
      this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
      console.log("@@@@sock", this.sock);
      this.ws = Stomp.over(this.sock);
      this.ws.connect(
        {},
        (frame) => {
          console.log(frame);
          this.ws.subscribe(`/sub/canvas/room/${this.roomId}`, (message) => {
            const recv = JSON.parse(message.body);
            this.recvMessage(recv);
          });
          this.ws.send(
            `/pub/canvas/message`,
            {},
            JSON.stringify({
              type: "ENTER",
              roomId: this.roomId,
              sender: this.sender,
            })
          );
        },
        (error) => {
          console.log(error);
          if (this.reconnect++ <= 5) {
            setTimeout(() => {
              console.log("connection reconnect");
              this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
              this.ws = Stomp.over(this.sock);
              this.connect();
            }, 10 * 1000);
          }
        }
      );
    },
    // beforeRouteLeave(to, from, next) {
    //   // 구독 해제 및 WebSocket 연결 종료
    //   if (this.subscription) {
    //     this.subscription.unsubscribe();
    //     console.log("WebSocket subscription unsubscribed.");
    //   }
    //   if (this.ws) {
    //     this.ws.disconnect(() => {
    //       console.log("WebSocket connection closed.");
    //     });
    //   }
    //   next(); // 라우트 변경을 계속 진행
    // },
  },
  beforeUnmount() {
    // 컴포넌트가 파괴되기 전에 구독 해제 및 WebSocket 연결 종료
    if (this.subscription) {
      this.subscription.unsubscribe(); // 구독 해제
      console.log("WebSocket subscription unsubscribed.");
    }
    if (this.ws) {
      this.ws.disconnect(() => {
        console.log("WebSocket connection closed.");
      });
    }
  },
};
</script>

<!-- <style scoped>
[v-cloak] {
  display: none;
}
</style> -->
