<template>
  <v-navigation-drawer :width="242">
    <v-list-item title="sub menu" subtitle="Vuetify"></v-list-item>
    <v-divider></v-divider>
    <v-list-item link title="List Item 1"></v-list-item>
    <v-list-item link title="List Item 2"></v-list-item>
    <v-list-item link title="List Item 3"></v-list-item>
  </v-navigation-drawer>
</template>


<script>
export default {
  name: "InnerRelatedMenuHome",
  components: {},
};
</script>