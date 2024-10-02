<template>
  <div class="success-page">
    <h1>로그인 성공</h1>

    <!-- 로그아웃 버튼 -->
    <button @click="logout">로그아웃</button>

    <!-- 멤버 정보 확인 버튼 -->
    <button @click="fetchMemberInfo">멤버 정보 확인</button>

    <!-- 응답 메시지 출력 -->
    <div v-if="memberInfo">
      <h3>응답: {{ memberInfo }}</h3>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      memberInfo: null, // API 응답 저장
    };
  },
  mounted() {
    this.handleOAuth2Success();
  },
  methods: {
    handleOAuth2Success() {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");

      if (accessToken && refreshToken) {
        try {
          this.saveTokens(accessToken, refreshToken);
          // this.$router.push({ name: "HOME" });
        } catch (error) {
          console.error("토큰 저장 중 에러 발생:", error);
        }
      } else {
        console.error("토큰이 존재하지 않습니다.");
      }
    },
    saveTokens(accessToken, refreshToken) {
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("Tokens saved successfully");
      } catch (error) {
        console.error("로컬 스토리지 저장 실패:", error);
      }
    },
    // 로그아웃 메서드
    logout() {
      try {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this.$router.push("/login");
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
      }
    },
    // 멤버 정보 확인 메서드
    async fetchMemberInfo() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("액세스 토큰이 없습니다.");
          return;
        }

        // Axios GET 요청 보내기
        const baseUrl = `${process.env.VUE_APP_BASE_URL}`; // process.env로 환경 변수에 접근
        console.log(baseUrl);
        const response = await axios.get(baseUrl + "/api/v1/member/me");

        // 응답 데이터를 memberInfo에 저장
        this.memberInfo = response.data;
        console.log("응답:", response.data);
      } catch (error) {
        console.error("멤버 정보 요청 중 에러 발생:", error);
      }
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #ff4b5c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #ff0000;
}

h3 {
  margin-top: 20px;
}
</style>
