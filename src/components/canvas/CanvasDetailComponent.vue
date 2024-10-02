<template>
  <div class="canvasDetailComponentContainer">
    <!-- <h2>{{ room.title }}</h2> -->
    <v-row class="canvasTitleContainer">
      <v-col class="p-0">
        <v-text-field
          color="primary"
          density="compact"
          class="canvasTitle"
          variant="plain"
          v-model="room.title"
          @keyup.enter="changeCanvasName"
        ></v-text-field>
      </v-col>
      <v-col class="p-0" style="text-align: right">
        <v-icon icon="mdi-delete" @click="deleteCanvas" />
      </v-col>
    </v-row>
    <hr />
    <div>
      <TipTabEditor
        v-if="this.editorContent != null"
        :initialContent="editorContent"
        :parentUpdateEditorContent="parentUpdateEditorContent"
        v-model="content"
      />
    </div>
  </div>
</template>

<script>
import TipTabEditor from "@/components/tiptab/TipTabEditor.vue";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

export default {
  name: "CanvasDetailComponent",
  props: {
    canvasId: {
      type: Number,
      required: true,
    },
  },
  watch: {
    canvasId(newId) {
      this.handleCanvasIdChange(newId);
    },
  },
  components: {
    TipTabEditor,
  },
  data() {
    return {
      room: {},
      sender: "",
      member: "",
      message: "",
      messages: [],
      ws: null,
      wsBlock: null,
      sock: null,
      sockBlock: null,
      reconnect: 0,

      detailCanvasId: null,
      canvas: {},
      blocks: [],

      defaultBlockFeIds: [],
      activeBlockId: null,
      lastBlockId: null,
      lastBlockContent: null,
      editorContent: null,
      parentUpdateEditorContent: "초기 값",

      recentKeyboardKey: null,
    };
  },
  mounted() {
    console.error("생성중...")
    this.sender = localStorage.getItem("wschat.sender");

    window.addEventListener("keydown", this.onKeydown); // 키보드 입력 이벤트 감지

    this.handleCanvasIdChange(this.canvasId);
  },
  methods: {
    handleCanvasIdChange(newCanvasId) {
      console.error("생성중...222 >>", newCanvasId)
      this.detailCanvasId = newCanvasId;
      this.member = localStorage.getItem("wschat.sender");
      this.getCanvasAndBlockInfo();
      this.connect();
    },
    async getCanvasAndBlockInfo() {
      const response = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/canvas/${this.detailCanvasId}`
      );

      this.room = response.data.result;

      // console.log("####", response.data.result);

      const blockResponse = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/block/${this.detailCanvasId}/list`
      );
      this.blocks = blockResponse.data.result;
      this.defaultBlockFeIds = blockResponse.data.result.map((el) => {
        return el.feId;
      });

      this.settingEditorContent();
      // this.editorContent = ``;
    },
    settingEditorContent() {
      let blockToEditorContentArr = [];
      for (const block of this.blocks) {
        // console.log(block);
        let tempBlockObj = {
          type: block.type,
          attrs: {
            id: block.feId,
          },
        };
        if (block.content != null) {
          tempBlockObj.content = [
            {
              type: "text",
              text: block.content == null ? "" : block.content,
            },
          ];
        }

        blockToEditorContentArr.push(tempBlockObj);
      }

      this.editorContent = {
        type: "doc",
        content: blockToEditorContentArr,
      };
    },
    sendMessage() {
      if (this.ws && this.ws.connected) {
        this.ws.send(
          `/pub/block/message`,
          {},
          JSON.stringify({
            type: "CANVAS",
            roomId: this.detailCanvasId,
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
          // if (this.member == blockJson.member) {
          console.log(
            "현 focus 부분이랑 같은 block 수정 중인 부분.. => block Id 동일함"
          );
        } else {
          console.log("다른 block Id 수정 중!~");
          this.parentUpdateEditorContent = blockJson;
        }
      } else {
        this.messages.unshift({
          type: recv.type,
          member: recv.type === "ENTER" ? "[알림]" : recv.member,
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
          this.ws.subscribe(
            `/sub/canvas/room/${this.detailCanvasId}`,
            (message) => {
              const recv = JSON.parse(message.body);
              this.recvMessage(recv);
            }
          );
          this.ws.send(
            `/pub/canvas/message`,
            {},
            JSON.stringify({
              type: "ENTER",
              roomId: this.detailCanvasId,
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
            `/sub/block/room/${this.detailCanvasId}`,
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
              roomId: this.detailCanvasId,
              member: this.member,
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
    beforeRouteLeave() {
      // 컴포넌트 제거 시 이벤트 리스너 제거
      window.removeEventListener("keydown", this.onKeydown);

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

      const blockMethod = this.checkBlockMethod(blockFeId, blockContent);
      this.message = {
        method: blockMethod,
        canvasId: this.canvasId,
        prevBlockId: previousId,
        parentBlockId: parentId,
        contents: blockContent,
        type: blockElType,
        feId: blockFeId,
        member: this.sender, // 현재 접속한 user ⭐ 추후 변경
      };

      this.lastBlockId = this.activeBlockId;
      this.lastBlockContent = blockContent;

      this.sendMessage();
    },
    checkBlockMethod(targetBlockFeId) {
      const found = this.defaultBlockFeIds.find(
        (element) => element == targetBlockFeId
      );

      console.error(
        `${this.recentKeyboardKey}, ${this.lastBlockId}, ${targetBlockFeId}, ${this.lastBlockContent}`
      );
      // delete 했을 때의 라인값이 잡히지 않아서, 최근 수정한 값, 현재 값을 비교하면서 진행
      if (
        this.recentKeyboardKey == 8 && //현재 키보드가 지우기(backspace)
        this.lastBlockId != targetBlockFeId && // 마지막 block id와 현 active block id가 다를 때
        this.lastBlockContent == "" // 마지막 block content가 비어있을 때
      ) {
        const index = this.defaultBlockFeIds.indexOf(this.lastBlockId);
        if (index !== -1) {
          this.defaultBlockFeIds.splice(index, 1); // 배열에서 해당 값을 삭제
        }
        return "delete";
      }

      if (found) {
        // block의 생성, 수정, 삭제 (create, update, delete)
        console.error("찾은거 하기...", this.recentKeyboardKey);
        return "update";
      } else {
        this.defaultBlockFeIds.push(targetBlockFeId);
        return "create";
      }
    },

    changeCanvasName() {
      console.error(this.room.title);
    },
    deleteCanvas() {
      console.log("canvas 삭제 예정");
    },
    onKeydown(event) {
      this.recentKeyboardKey = event.keyCode; // 누른 키 값을 저장
      // 8 : 백스페이스
    },
  },
  beforeUnmount() {
    this.beforeRouteLeave();
  },
};
</script>

<style lang="scss">
.canvasDetailComponentContainer {
  display: flex;
  flex-direction: column;
  padding: 24px;
  .canvasTitleContainer {
    align-items: center;
  }
  .canvasTitle {
    input {
      font-size: 2em;
      font-weight: bold;
    }
    .v-input__details {
      display: none;
    }
  }
}
</style>
