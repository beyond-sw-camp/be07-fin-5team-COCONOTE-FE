<template>
  <v-app-bar :elevation="2" class="topMenu" height="40">
    <v-app-bar-title class="title"> COCONOTE </v-app-bar-title>
    <template v-slot:append>
      <v-select
        v-model="selectedItem"
        :items="items"
        outlined
        single-line
        hide-details
        dense
        class="inline"
        style="font-size:0.9rem"
      ></v-select>
    </template>
  </v-app-bar>
</template>


<script>
export default {
  name: "CommonTopMenu",
  components: {},
  data() {
    return {
      items: [{ title: "A 워크스페이스" }, { title: "B 워크스페이스" }],
      selectedItem: "A 워크스페이스",
    };
  },
};
</script>

<style lang="scss">
.topMenu {
  &.v-toolbar {
    background-color: #383f4a !important;
    * {
      color: #fff;
    }
  }
  .title {
    font-size: 0.9rem; /* v-app-bar-title의 폰트 크기 설정 */
  }
  .v-select *{
    font-size: 0.8rem;
  }
}
</style>
