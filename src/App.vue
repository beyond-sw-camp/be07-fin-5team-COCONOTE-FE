<template>
  <v-app class="app global_bg">
    <CommonTopMenu />
    <div>
      <InnerMenu />
    </div>
    <!-- <HeaderComponent @open-sidebar="toggleSidebar" /> -->
    <!-- <AppSidebar ref="sidebar" /> -->
    <v-sheet class="main-content">
      <router-view />
    </v-sheet>
    <!-- <FooterComponent /> -->
  </v-app>
</template>

<script>
import CommonTopMenu from "@/components/basic/CommonTopMenu.vue";
import InnerMenu from "@/components/basic/InnerMenu.vue";

export default {
  name: 'App',
  components: {
    CommonTopMenu,
    InnerMenu
  }
}
</script>
