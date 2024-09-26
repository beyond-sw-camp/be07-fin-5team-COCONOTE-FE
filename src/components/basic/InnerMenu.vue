<template>
  <v-navigation-drawer class="innerMenu" theme="dark" permanent rail>
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="home"
        @click="selectedMenu = 'home'"
        :class="{'selected-item': selectedMenu === 'home'}"
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-account-group"
        title="member"
        @click="selectedMenu = 'member'"
        :class="{'selected-item': selectedMenu === 'member'}"
      ></v-list-item>
        
    </v-list>
  </v-navigation-drawer>

  <div v-if="selectedMenu === 'home'">
    <InnerRelatedMenuHome />
  </div>
  <div v-if="selectedMenu === 'member'">
    <InnerRelatedMenuMember />
  </div>
</template>


<script>
import InnerRelatedMenuHome from "@/components/basic/InnerRelatedMenuHome.vue";
import InnerRelatedMenuMember from "@/components/basic/InnerRelatedMenuMember.vue";
export default {
  name: "InnerMenu",
  components: {
    InnerRelatedMenuHome,
    InnerRelatedMenuMember,
  },
  data() {
    return {
      // 선택된 메뉴를 저장할 변수
      selectedMenu: "home", // 기본값으로 'home'을 선택
    };
  },
};
</script>

<style lang="scss">
.innerMenu {
  background: #32446e !important;

  .selected-item {
    background-color: #7280A2; /* 선택된 항목의 배경 색상 */
  }
}
</style>