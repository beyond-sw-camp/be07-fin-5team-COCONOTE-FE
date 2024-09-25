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
        <button class="btn btn-primary" type="button" @click="sendMessage">
          블록추가
        </button>
      </div>
    </div>
    <ul class="list-group">
      <li
        class="list-group-item"
        v-for="message in messages"
        :key="message.timestamp"
      >
        {{ message.sender }} - {{ message.message }}
      </li>
    </ul>
    <ul class="block-group">
      <li class="block-group-item" v-for="block in blocks" :key="block.id">
        {{ block.id }} >> {{ block.content }}
        <ul class="block-kid-group" v-if="block.childBlock.length > 0">
          <li
            class="block-group-item"
            v-for="childrenBlock in block.childBlock"
            :key="childrenBlock.id"
          >
            {{ childrenBlock.id }} :: {{ childrenBlock.content }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div>
    <TipTabEditor
      v-if="this.editorContent != null"
      :initialContent="editorContent"
      v-model="content"
    />
  </div>
</template>

<script>
import TipTabEditor from "@/components/tiptab/TipTabEditor.vue";
import axios from "axios";
import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import { Stomp } from "@stomp/stompjs";

export default {
  name: "CanvasDetailComponent",
  components: {
    TipTabEditor,
  },
  data() {
    return {
      canvasId: "",
      room: {},
      sender: "",
      message: "",
      messages: [],
      ws: null,
      wsBlock: null,
      sock: null,
      sockBlock: null,
      reconnect: 0,
      canvas: {},
      blocks: [],

      activeBlockId: null,
      editorContent: null,
    };
  },
  mounted() {
    this.roomId = localStorage.getItem("wschat.canvasId");
    this.canvasId = this.roomId;

    this.sender = localStorage.getItem("wschat.sender");
    this.getCanvasAndBlockInfo();
    this.connect();
  },
  methods: {
    async getCanvasAndBlockInfo() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/canvas/${this.roomId}`
      );

      this.room = response.data.result;

      console.log("####", response.data.result);

      const blockResponse = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/block/${this.room.id}/list`
      );
      this.blocks = blockResponse.data.result;

      this.settingEditorContent();
      // this.editorContent = ``;
    },
    settingEditorContent() {
      let blockToEditorContentArr = [];
      for (const block of this.blocks) {
        console.log(block);
        let tempBlockObj = {
          type: block.type,
          attrs: {
            id: block.feId,
          },
        };
        if(block.content != null){
          tempBlockObj.content = [
            {
              type: "text",
              text: block.content == null ? "" : block.content,
            },
          ]
        }

        blockToEditorContentArr.push(tempBlockObj);
      }

      this.editorContent =
        {
          "type": "doc",
          "content": blockToEditorContentArr
        };
    },
    sendMessage() {
      if (this.ws && this.ws.connected) {
        console.log(
          "@@@@@@@@@@@@@@@@@@@@@@@@@@Sending message:@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
          {
            type: "CANVAS",
            roomId: this.roomId,
            sender: this.sender,
            message: JSON.stringify(this.message),
          }
        );

        this.ws.send(
          `/pub/block/message`,
          {},
          JSON.stringify({
            type: "CANVAS",
            roomId: this.roomId,
            sender: this.sender,
            message: JSON.stringify(this.message),
          })
        );
        this.message = "";
      } else {
        // console.log("WebSocket is not connected.");
      }
    },
    recvMessage(recv) {
      if (recv.type === "CANVAS") {
        const blockJson = JSON.parse(recv.message);
        // console.log("blockJson", blockJson);
        if (this.activeBlockId == blockJson.feId) {
          console.log("내가 수정 중인 부분..");
        } else {
          console.log("다른사람이 수정 중!~");
        }
      } else {
        this.messages.unshift({
          type: recv.type,
          sender: recv.type === "ENTER" ? "[알림]" : recv.sender,
          message: recv.message,
        });
      }
    },
    connect() {
      // this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
      this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
      this.ws = Stomp.over(this.sock);
      this.ws.connect(
        {},
        () => {
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
        () => {
          if (this.reconnect++ <= 5) {
            setTimeout(() => {
              this.sock = new SockJS(
                `${process.env.VUE_APP_API_BASE_URL}/ws-stomp`
              );
              this.ws = Stomp.over(this.sock);
              this.connect();
            }, 10 * 1000);
          }
        }
      );
      // block 용 websocket
      this.sockBlock = new SockJS(
        `${process.env.VUE_APP_API_BASE_URL}/ws-stomp`
      );
      this.wsBlock = Stomp.over(this.sockBlock);
      this.wsBlock.connect(
        {},
        () => {
          this.wsBlock.subscribe(
            `/sub/block/room/${this.roomId}`,
            (message) => {
              const recv = JSON.parse(message.body);
              this.recvMessage(recv);
            }
          );
          this.wsBlock.send(
            `/pub/block/message`,
            {},
            JSON.stringify({
              type: "ENTER",
              roomId: this.roomId,
              sender: this.sender,
            })
          );
        },
        () => {
          if (this.reconnect++ <= 5) {
            setTimeout(() => {
              this.sockBlock = new SockJS(
                `${process.env.VUE_APP_API_BASE_URL}/ws-stomp`
              );
              this.wsBlock = Stomp.over(this.sockBlock);
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

    // tiptabEditor method
    updateBlock(blockFeId, blockElType, blockContent, previousId, parentId) {
      if (!blockFeId) {
        return false;
      }
      console.log("⭐⭐⭐⭐⭐⭐editor에서 호출⭐⭐⭐⭐⭐");
      console.log(
        blockFeId,
        blockContent,
        `  previousId >> ${previousId}  \n parentId >> ${parentId}`
      );

      this.activeBlockId = blockFeId;

      this.message = {
        method: "create", // block의 생성, 수정, 삭제 (create, update, delete)
        canvasId: this.canvasId,
        prevBlockId: previousId,
        parentBlockId: parentId,
        contents: blockContent,
        type: blockElType,
        feId: blockFeId,
      };

      this.sendMessage();
    },
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
