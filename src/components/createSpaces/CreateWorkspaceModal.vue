<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center">
        워크스페이스 생성하기 </v-card-title
      ><br />
      <v-card-text>
        <v-form @submit.prevent="createWorkspace">
          <v-text-field
            label="name"
            v-model="name"
            required
          >
          </v-text-field>
          <v-text-field
            label="wsInfo"
            v-model="wsInfo"
            required
          >
          </v-text-field>
          <v-btn type="submit" color="blue">완료</v-btn>
          <v-btn color="grey" @click="closeModal">닫기</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            name:"",
            wsInfo:"",
        }
    },
    methods: {
        async createWorkspace() {
            const body = {
                name:this.name,
                wsInfo:this.wsInfo,
            }
            try {
                const token = "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJtaW5qaTIyNzZAZ21haWwuY29tIiwiaWF0IjoxNzI3ODM0NTQ0LCJleHAiOjE3Mjg0MzkzNDR9.l3yDcj9uMg1iT_71PTeihdjUgp974t-Oz_ucZnmOQHF-i4d7la7X1MOY-WCNPaQx";
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/workspace/create`, body, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 토큰을 헤더에 추가
                    }
                });
                this.$emit('update:dialog', false);
            } catch(e) {
                console.log(e);
            }
        },
        closeModal() {
            this.$emit('update:dialog', false);
        }
    }
}
</script>
