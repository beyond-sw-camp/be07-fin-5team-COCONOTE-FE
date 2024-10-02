<template>
  <div class="success-page">
    <h1>로그인 성공</h1>
    <!-- 로그아웃 버튼 추가 -->
    <button @click="logout">로그아웃</button>
  </div>
</template>

<script>
export default {
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
    // 로그아웃 메서드 추가
    logout() {
      try {
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 로그아웃 후 로그인 페이지로 리다이렉트
        this.$router.push("/login"); // 실제 로그인 경로로 변경
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
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
</style>
