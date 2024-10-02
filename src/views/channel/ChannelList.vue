<template>
  <div class="channelInsideContainer">
    <h1>Channel List : 테스트용, 추후 view로 이동될 예정</h1>
    <p>workspaceId : {{ workspaceId }}</p>
    <p>workspaceName : {{ workspaceName }}</p>
  </div>
</template>

<script>

export default {
  computed: {
    workspaceId() {
      return this.$store.getters.getWorkspaceId; // Vuex의 getter 사용
    },
    workspaceName() {
      return this.$store.getters.getWorkspaceName;
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss"></style>
