<template>
  <v-app class="app global_bg" style="height:100%;">
    <v-sheet style="height:100%;">
      <v-row no-gutters>
        <v-col cols="12" class="CommonTopContainer" v-if="showHeaderAndSidebar">
          <CommonTopMenu @selected="handleSelected" />
        </v-col>
      </v-row>
      <v-row no-gutters  style="height:100%;">
        <v-col cols="2" v-if="showHeaderAndSidebar">
          <div class="d-flex innerMenuContainer">
            <InnerMenu :selectedValue="selectedValue" />
          </div>
        </v-col>
        <v-col :cols="showHeaderAndSidebar ? 10 : 12">
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
  computed: {
    showHeaderAndSidebar() {
      return this.$route.meta.showHeaderAndSidebar !== false;
    },
  },
  name: "App",
  components: {
    CommonTopMenu,
    InnerMenu,
  },
  data() {
    return {
      selectedValue: null,
      workspaceInfo: [],
    };
  },
  methods: {},
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
}
.main-content {
  height: calc(100% - 40px);
}
</style>