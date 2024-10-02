<template>
  <v-app>
    <h1>test</h1>

    <!-- 로그인 상태에 따라 버튼을 조건부 렌더링 -->
    <v-btn v-if="!isLoggedIn" @click="login">로그인</v-btn>
    <v-btn v-if="isLoggedIn" @click="logout">로그아웃</v-btn>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false, // 로그인 상태 관리
    };
  },
  created() {
    // 페이지가 로드될 때 로그인 상태 확인
    this.checkLoginStatus();
  },
  methods: {
    // 로그인 버튼 클릭 시
    login() {
      // /login 페이지로 이동
      this.$router.push("/login");
    },
    // 로그아웃 버튼 클릭 시
    logout() {
      // 로그아웃 처리: localStorage에서 토큰 제거
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.isLoggedIn = false; // 로그인 상태 갱신
    },
    // 로그인 상태 확인
    checkLoginStatus() {
      const accessToken = localStorage.getItem("accessToken");
      // accessToken이 있으면 로그인 상태로 설정
      this.isLoggedIn = !!accessToken;
    },
  },
};
</script>
