<template>
    <v-app>
      <div>
        <h2>{{room.name}}</h2>
      </div>
      <ul class="list-group" ref="messageList" id="list-group">
          <li class="list-group-item" v-for="message in messages.slice().reverse()" :key="message.id">
            <ThreadComponentVue :id="message.id" :image="message.image" :nickName="message.memberName" :createdTime="message.createdTime" :content="message.content" :files="message.files"/>
          </li>
      </ul>
      <div class="input-group">
        <div class="input-group-prepend">
            <label class="input-group-text">내용</label>
        </div>
        <input type="text" class="form-control" v-model="message" v-on:keypress.enter="sendMessage">
        <div class="input-group-append">
            <button class="btn btn-primary" type="button" @click="sendMessage">보내기</button>
        </div>
    </div>
    </v-app>
  </template>
  
  <script>
import ThreadComponentVue from '@/components/thread/ThreadComponent.vue';
import axios from "axios";
import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import { Stomp } from "@stomp/stompjs";
import { debounce } from 'lodash';
  
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    components: {
      ThreadComponentVue,
    },
    data() {
      return {
        roomId: '',
        room: { "name":"sehotest" },
        sender: 1,
        message: '',
        messages: [],
        ws: null,
        sock: null,
        reconnect: 0,
        pageSize: 20,
        currentPage: 0,
        isLoading: false,
        isLastPage: false,
      };
    },
    created() {
      this.roomId = this.id
      this.getMessageList();
      this.connect();
      this.scrollToBottom();
      // window.addEventListener('scroll', this.scrollPagination)
      // this.$refs.messageList.addEventListener('scroll', this.scrollPagination);
    },
    mounted() {
      this.$refs.messageList.addEventListener('scroll', this.debouncedScrollPagination);
    },
    updated(){
        
    },
    beforeUnmount() {
      // window.removeEventListener('scroll', this.scrollPagination)
      this.$refs.messageList.removeEventListener('scroll', this.debouncedScrollPagination);
    },
    computed: {

    },
    methods: {
      async getMessageList(){
        try {
              let params = {
                      size: this.pageSize,
                      page: this.currentPage,
                  }
              const response = await axios.get(`http://localhost:8080/api/v1/thread/list/${this.id}`, { params })
              this.currentPage++;
              this.isLastPage = response.data.result.last
              // this.messages = [...this.messages, ...response.data.result.content]
              
              // 기존 메시지의 ID 집합을 생성
              const existingMessageIds = new Set(this.messages.map(msg => msg.id));

              // 중복되지 않은 메시지만 필터링
              const newMessages = response.data.result.content.filter(msg => !existingMessageIds.has(msg.id));

              // 중복되지 않은 메시지를 추가
              this.messages = [...this.messages, ...newMessages];

            } catch (e) {
                console.log(e);
            }
      },
      debouncedScrollPagination: debounce(async function() {
        const list = document.getElementById('list-group');
        const isTop = list.scrollTop <= 20;

        if (isTop && !this.isLastPage && !this.isLoading) {
          this.isLoading = true;
          if(list.scrollTop==0 && !this.isLastPage){
            list.scrollTop=20
          }
          await this.getMessageList();
          this.isLoading = false;
        }
      }, 200),
      async scrollPagination() {
        const list = document.getElementById('list-group');
        const isTop = list.scrollTop <= 100;
        // "현재화면 + 스크롤로 이동한 화면 > 전체화면 -n" 의 조건이 성립되면 추가 데이터 로드
        // const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
        console.log("scrollPagination%%%%%%%%%%%%%%%%%%%");

        if (isTop && !this.isLastPage && !this.isLoading) {
            this.isLoading = true
            await this.getMessageList()
            this.isLoading = false
        }
      },
      scrollToBottom() {
        // 메시지 목록을 감싸는 컨테이너 찾기
        const container = document.getElementById('list-group');
        if (container) {
            
            // 잠시 딜레이를 주고 스크롤을 최하단으로 이동
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 100);
        }
      },  
      sendMessage() {
          this.ws.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', channelId: this.roomId, senderId: this.sender, content: this.message}));
          this.message = '';
      },
      recvMessage(recv) {
          this.messages.unshift({id: recv.id, memberName: recv.memberName, content: recv.content, image: recv.image, createdTime: recv.createdTime, files: recv.files})
          this.scrollToBottom();
      },
      connect() {
        this.sock = new SockJS(`http://localhost:8080/api/v1/ws-stomp`);
        this.ws = Stomp.over(this.sock);
        
        this.ws.connect({}, (frame) => {
            console.log("frame: ",frame);
            this.ws.subscribe(`/sub/chat/room/${this.roomId}`, (message) => {
              const recv = JSON.parse(message.body);
              this.recvMessage(recv);
            });
            this.ws.send("/pub/chat/message", {}, JSON.stringify({type:'ENTER', channelId: this.roomId, senderId: this.sender}));
        }, (error) => {
          console.log(error);
            if(this.reconnect++ <= 5) {
              setTimeout(() => {
                console.log("connection reconnect");
                this.sock = new SockJS(`http://localhost:8080/api/v1/ws-stomp`);
                this.ws = Stomp.over(this.sock);
                this.connect();
              }, 10 * 1000);
            }
        });
      }
    },
  };
  </script>
  
<style scoped>
.v-app {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 화면 전체 높이 사용 */
}

.list-group {
    flex-grow: 1; /* 리스트가 가능한 공간을 모두 차지 */
    overflow-y: auto; /* 세로 스크롤 가능 */
    max-height: calc(100vh - 120px);
}

.input-group {
    height: 50px;
    position: sticky;
    bottom: 0; /* 하단에 고정 */
    background-color: white; /* 배경색 설정 */
    padding: 10px; /* 여백 추가 */
    z-index: 1; /* 리스트 위에 표시되도록 */
}
</style>
