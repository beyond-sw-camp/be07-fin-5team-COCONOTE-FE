<template>
  <v-dialog max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center">
        워크스페이스 회원 초대하기</v-card-title
      ><br />
      <v-card-text>
        <v-form @submit.prevent="sendMail">
          <v-text-field
            label="email"
            v-model="email"
            prepend-icon="mdi-email"
            type="email"
            required
          >
          </v-text-field>
          <v-btn type="submit" color="blue">전송</v-btn>
          <v-btn color="grey" @click="closeModal">닫기</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
      props: {
    selectedValue: {
      type: Number,
    }
  },
    data() {
        return {
            email:"",
        }
    },
    methods: {
        async sendMail() {
    try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/email/request/${this.selectedValue}?email=${this.email}`);
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
