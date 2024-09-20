<template>
  <v-sheet class="global_bg">
    <!-- <HeaderComponent @open-sidebar="toggleSidebar" /> -->
    <!-- <AppSidebar ref="sidebar" /> -->
    <v-sheet>
      <router-view />
    </v-sheet>
    <!-- <FooterComponent /> -->
  </v-sheet>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
