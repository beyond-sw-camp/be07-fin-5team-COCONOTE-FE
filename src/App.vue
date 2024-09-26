<template>
  <v-app class="app global_bg">
    <CommonTopMenu />
    <div>
      <InnerMenu />
    </div>
    
    
    <v-sheet class="main-content">
      <router-view />
    </v-sheet>
    
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
