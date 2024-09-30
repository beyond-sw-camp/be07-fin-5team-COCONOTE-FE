<template>
  <div class="login-page">
    <h1>Login</h1>
    <div class="login-buttons">
      <button @click="loginWithGoogle" class="google-login">Login with Google</button>
      <button @click="loginWithKakao" class="kakao-login">Login with Kakao</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    },
    loginWithKakao() {
      window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
    },
  },
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.google-login {
  padding: 1rem;
  background-color: #db4437;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.kakao-login {
  padding: 1rem;
  background-color: #fee500;
  color: #3c1e1e;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.google-login:hover {
  background-color: #c33d2e;
}

.kakao-login:hover {
  background-color: #e5c400;
}
</style>
