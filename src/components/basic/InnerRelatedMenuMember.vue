<template>
  <v-navigation-drawer permanent class="innerSubMenu" :width="220">
    <h1>코코노트 동아리</h1>
    <v-list>
      <v-list-item
        title="멤버"
        @click="selectedMenu = 'InnerRelated멤버MenuHome'"
        :class="{ 'selected-item': selectedMenu === '멤버' }"
        class="channel-item"
      ></v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "InnerRelatedMenuMember",
  components: {},
};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>