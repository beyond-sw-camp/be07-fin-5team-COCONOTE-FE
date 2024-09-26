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
import CommonTopMenu from "@/components/basic/AppbarComponent.vue";
import HeaderComponent from "@/components/basic/HeaderComponent.vue";

export default {
  name: 'App',
  components: {
    AppbarComponent,
    HeaderComponent
  }
}
</script>
