<template>
    <v-app>
      <h1>thread</h1>
      <div>
        <h2>{{room.name}}</h2>
      </div>
      <div class="input-group">
          <div class="input-group-prepend">
              <label class="input-group-text">내용</label>
          </div>
          <input type="text" class="form-control" v-model="message" v-on:keypress.enter="sendMessage">
          <div class="input-group-append">
              <button class="btn btn-primary" type="button" @click="sendMessage">보내기</button>
          </div>
      </div>
      <ul class="list-group">
          <li class="list-group-item" v-for="message in messages" :key="message.id">
            <ThreadComponentVue :image="message.image" :nickName="message.memberName" :createdTime="message.createdTime" :content="message.content" :files="message.files"/>
          </li>
      </ul>
    </v-app>
  </template>
  
  <script>
import ThreadComponentVue from '@/components/thread/ThreadComponent.vue';
import axios from "axios";
import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import { Stomp } from "@stomp/stompjs";
  
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
      window.addEventListener('scroll', this.scrollPagination)
    },
    updated(){
        
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.scrollPagination)
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
                this.messages = [...this.messages, ...response.data.result.content]
            } catch (e) {
                console.log(e);
            }
      },
      async scrollPagination() {
        
        
            // "현재화면 + 스크롤로 이동한 화면 > 전체화면 -n" 의 조건이 성립되면 추가 데이터 로드
            const isBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20;
            if (isBottom && !this.isLastPage && !this.isLoading) {
              console.log("here%%%%%%%%%%%%%%%%%%%");
                this.isLoading = true
                await this.getMessageList()
                this.isLoading = false
            }
        },
      sendMessage() {
          this.ws.send("/pub/chat/message", {}, JSON.stringify({type:'TALK', channelId: this.roomId, senderId: this.sender, content: this.message}));
          this.message = '';
      },
      recvMessage(recv) {
          this.messages.unshift({id: recv.id, memberName: recv.memberName, content: recv.content, image: recv.image, createdTime: recv.createdTime, files: recv.files})
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
  