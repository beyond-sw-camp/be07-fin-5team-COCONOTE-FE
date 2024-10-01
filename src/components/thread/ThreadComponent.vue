<template>
  <div class="container">
    <ul class="list-group" ref="messageList" id="list-group">
      <li
        class="list-group-item"
        v-for="(message,index) in messages.slice().reverse()"
        :key="message.id"
      >
      <div v-if="index > 0 && this.isDifferentDay(message.createdTime,  messages.slice().reverse()[index-1].createdTime)">
        <div style="display: flex; align-content: center; text-align: center; margin: auto;">
            <hr style="width: 27%; margin:auto;"><span style="margin:auto;">{{this.getDay(message.createdTime)}}</span><hr style="width: 27%; margin:auto;">
        </div>
    </div>
        <ThreadLineComponent
          :id="message.id"
          :image="message.image"
          :nickName="message.memberName"
          :createdTime="this.getTime(message.createdTime)"
          :content="message.content"
          :files="message.files"
        />
      </li>
    </ul>
    
    <div class="input-group">
      <div class="image-group">
        <div v-for="(file, index) in fileList" :key="index">
          <button type="button" @click="deleteImage(index)">삭제</button>
          <img :src="file.imageUrl" alt="image" style="height: 120px; width: 120px; object-fit: cover;">
          <p class="custom-contents">{{file.name}}</p>
        </div>
      </div>
        
      <div class="text-group">
        <v-file-input v-model="files" @change="fileUpdate" multiple hide-input></v-file-input>
        <input
          type="text"
          class="form-control"
          v-model="message"
          v-on:keypress.enter="sendMessage"
        />
        <div class="input-group-append">
          <button class="btn btn-primary" type="button" @click="sendMessage" :disabled="!message">보내기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ThreadLineComponent from "@/components/thread/ThreadLineComponent.vue";
import axios from "axios";
import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import { Stomp } from "@stomp/stompjs";
import { debounce } from "lodash";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    ThreadLineComponent,
  },
  data() {
    return {
      workspaceId: 2,
      roomId: "",
      room: { name: "sehotest" },
      sender: 1,
      message: "",
      messages: [],
      ws: null,
      sock: null,
      reconnect: 0,
      pageSize: 40,
      currentPage: 0,
      isLoading: false,
      isLastPage: false,
      files: null,
      fileList: [],
    };
  },
  created() {
    this.roomId = this.id;
    this.getMessageList();
    this.connect();
    this.scrollToBottom();
    // window.addEventListener('scroll', this.scrollPagination)
    // this.$refs.messageList.addEventListener('scroll', this.scrollPagination);
  },
  mounted() {
    this.$refs.messageList.addEventListener("scroll", this.debouncedScrollPagination);
  },
  updated() {},
  beforeUnmount() {
    // window.removeEventListener('scroll', this.scrollPagination)
    this.$refs.messageList.removeEventListener("scroll", this.debouncedScrollPagination);
    
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
  computed: {},
  methods: {
    fileUpdate(){
        this.files.forEach(file => {
          this.fileList.push({
            name: file.name,
            size: file.size,
            type: file.type, 
            imageUrl: URL.createObjectURL(file)})
        });
        
    },
    async getMessageList() {
      try {
        let params = {
          size: this.pageSize,
          page: this.currentPage,
        };

        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/thread/list/${this.id}`,
          { params }
        );
        this.currentPage++;
        this.isLastPage = response.data.result.last;
        // this.messages = [...this.messages, ...response.data.result.content]

        // 기존 메시지의 ID 집합을 생성
        const existingMessageIds = new Set(this.messages.map((msg) => msg.id));

        // 중복되지 않은 메시지만 필터링
        const newMessages = response.data.result.content.filter(
          (msg) => !existingMessageIds.has(msg.id)
        );

        // 중복되지 않은 메시지를 추가
        this.messages = [...this.messages, ...newMessages];
      } catch (e) {
        console.log(e);
      }
    },
    debouncedScrollPagination: debounce(async function () {
      const list = document.getElementById("list-group");
      const isTop = list.scrollTop <= 800;

      if (isTop && !this.isLastPage && !this.isLoading) {
        this.isLoading = true;
        if (list.scrollTop == 0 && !this.isLastPage) {
          list.scrollTop = 20;
        }
        await this.getMessageList();
        this.isLoading = false;
      }
    }, 200),
    async scrollPagination() {
      const list = document.getElementById("list-group");
      const isTop = list.scrollTop <= 1600;
      // "현재화면 + 스크롤로 이동한 화면 > 전체화면 -n" 의 조건이 성립되면 추가 데이터 로드
      // const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
      console.log("scrollPagination%%%%%%%%%%%%%%%%%%%");

      if (isTop && !this.isLastPage && !this.isLoading) {
        this.isLoading = true;
        await this.getMessageList();
        this.isLoading = false;
      }
    },
    scrollToBottom() {
      // 메시지 목록을 감싸는 컨테이너 찾기
      const container = document.getElementById("list-group");
      if (container) {
        // 잠시 딜레이를 주고 스크롤을 최하단으로 이동
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 100);
      }
    },
    async getPresignedURL(){
      const reqFiles = this.fileList.map(file => ({fileName:file.name, fileSize:file.size}))
      const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/files/presigned-urls`, reqFiles
        );
        console.log(response.data);
        
    },
    deleteImage(index){
      this.fileList.splice(index, 1);
    },
    sendMessage() {
      const authToken = localStorage.getItem('accessToken');
      if(this.fileList.length>0) this.getPresignedURL();
      this.ws.send(
        "/pub/chat/message",
        {Authorization: authToken},
        JSON.stringify({
          type: "TALK",
          channelId: this.roomId,
          senderId: this.sender,
          content: this.message,
          workspaceId: this.workspaceId,
        })
      );
      this.message = "";
    },
    recvMessage(recv) {
      this.messages.unshift({
        id: recv.id,
        memberName: recv.memberName,
        content: recv.content,
        image: recv.image,
        createdTime: recv.createdTime,
        files: recv.files,
      });
      this.scrollToBottom();
    },
    connect() {
      this.sock = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/ws-stomp`);
      this.ws = Stomp.over(this.sock);

      const authToken = localStorage.getItem('accessToken');
      this.ws.connect(
        {Authorization: authToken},
        (frame) => {
          console.log("frame: ", frame);
          this.ws.subscribe(`/sub/chat/room/${this.roomId}`, (message) => {
            const recv = JSON.parse(message.body);
            this.recvMessage(recv);
          });
          this.ws.send(
            "/pub/chat/message",
            {Authorization: authToken},
            JSON.stringify({
              type: "ENTER",
              channelId: this.roomId,
              senderId: this.sender,
              workspaceId: this.workspaceId,
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
    getTime(createdAt) {
            const createdTime = new Date(createdAt);
            let hour = createdTime.getHours();
            let minute = createdTime.getMinutes();
            let ampm;
            if(hour < 12) {
                ampm = '오전'
            } else {
                ampm = '오후'
                hour -= 12;
            }
            if(hour < 10) {
                hour = '0'+hour;
            }

            if(minute < 10) {
                minute = '0'+minute;
            }

            return ampm + ' ' + hour + ':' + minute;
        },
        isDifferentDay(d1, d2) {
            const day1 = new Date(d1);
            const day2 = new Date(d2);


            if(day1.getFullYear() == day2.getFullYear()
            && day1.getMonth() == day2.getMonth()
            && day1.getDay() == day2.getDay()) return false;

            return true;
        },
        getDay(createdAt) {
            const createdTime = new Date(createdAt);

            return `${createdTime.getFullYear()}년 ${createdTime.getMonth() + 1}월 ${createdTime.getDate()}일`; 
        }
  },
};
</script>

<style scoped>
.container {
  padding: 0 0 0 24px;
}

.list-group {
  flex-grow: 1; /* 리스트가 가능한 공간을 모두 차지 */
  overflow-y: auto; /* 세로 스크롤 가능 */
  max-height: calc(100vh - 240px);
}

.input-group {
  position: sticky;
  bottom: 0; /* 하단에 고정 */
  background-color: white; /* 배경색 설정 */
  z-index: 1; /* 리스트 위에 표시되도록 */
  border: 1px solid;
  margin-right: 24px;
}
.image-group {
  display: flex;
  flex-direction: row;
  width: 120px;
  max-height: 180px;
}
.text-group {
  display: flex;
  flex-direction: row;
}
.form-control {
    width: 100%;
}
.custom-contents{
  max-width: 120px; /* 제목의 최대 너비를 설정 */
  overflow: hidden; /* 내용이 넘칠 경우 숨김 처리 */
  text-overflow: ellipsis !important; /* 넘치는 텍스트에 '...' 추가 (이거 적용안됨 이후 수정필요)*/
  white-space: nowrap; /* 텍스트 줄 바꿈 방지 */
}
</style>
