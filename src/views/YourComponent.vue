<!-- src/views/YourComponent.vue -->
<template>
  <div>
    <h1>보호된 데이터</h1>
    <button @click="fetchProtectedData">데이터 가져오기</button>
  </div>
</template>

<script>
import apiClient from "@/services/axios";

export default {
  methods: {
    async fetchProtectedData() {
      try {
        const response = await apiClient.get("/hello");
        console.log("Protected data:", response.data);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        // 토큰 만료 시 리프레시 토큰으로 새로 발급받는 로직 추가 가능
      }
    },
  },
};
</script>
