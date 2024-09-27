<template>
  <v-app class="app global_bg">
    <!-- <v-row no-gutters>
      <v-col cols="12">
        <v-sheet class="pa-2">
          .v-col-12
        </v-sheet>
      </v-col>
      <v-col cols="2">
        <v-sheet class="pa-2 ma-2">
          .v-col-2
        </v-sheet>
      </v-col>
      <v-col>
        <v-sheet class="pa-2 ma-2">
          .v-col-auto
        </v-sheet>
      </v-col>
    </v-row> -->

    <v-sheet>
      <v-row no-gutters>
        <v-col cols="12" class="CommonTopContainer">
          <CommonTopMenu />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2">
          <div class="d-flex innerMenuContainer">
            <InnerMenu />
          </div>
        </v-col>
        <v-col>
          <v-sheet class="main-content">
            <router-view />
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
  </v-app>
</template>

<script>
import CommonTopMenu from "@/components/basic/CommonTopMenu.vue";
import InnerMenu from "@/components/basic/InnerMenu.vue";

export default {
  name: "App",
  components: {
    CommonTopMenu,
    InnerMenu,
  },
};
</script>

<style lang="scss">

.CommonTopContainer {
  height: 40px;
}
.innerMenuContainer {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  height: 100%;
  > * {
    padding: 0 !important;
  }
}
.main-content{
  height: calc(100% - 40px);
}
</style>