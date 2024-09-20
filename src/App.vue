<template>
  <v-app class="app global_bg">
    <!-- <HeaderComponent @open-sidebar="toggleSidebar" /> -->
    <!-- <AppSidebar ref="sidebar" /> -->
    <v-sheet class="main-content">
      <router-view />
    </v-sheet>
    <!-- <FooterComponent /> -->
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>
