<template>
  <v-navigation-drawer permanent class="innerSubMenu" :width="220">
    <h1>코코노트 동아리</h1>
    <v-list>
      <v-list-subheader class="section-title"> 
        <v-icon icon="mdi-menu-right" /> Group
      </v-list-subheader>
      <v-list-item
        title="InnerRelatedMenuHome"
        @click="selectedMenu = 'InnerRelatedMenuHome'"
        :class="{ 'selected-item': selectedMenu === 'InnerRelatedMenuHome' }"
        class="chenel-item"
      ></v-list-item>

      <v-list-item
        title="2"
        @click="selectedMenu = '2'"
        :class="{ 'selected-item': selectedMenu === '2' }"
      ></v-list-item>

      <v-list-item
        title="3"
        @click="selectedMenu = '3'"
        :class="{ 'selected-item': selectedMenu === '3' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
export default {
  name: "InnerRelatedMenuHome",
  components: {},
  data() {
    return {
      // 선택된 메뉴를 저장할 변수
      selectedMenu: "InnerRelatedMenuHome", // 기본값으로 'home'을 선택
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "@/assets/css/innerRelated.scss"; /* SCSS 파일을 불러오기 */
</style>