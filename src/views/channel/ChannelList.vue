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
  components: {

  },
  data() {
    return {
    };
  },
  created() {
    this.logWorkspaceInfo();
  },
  methods: {
    logWorkspaceInfo() {
      console.log(this.$store.getters.getWorkspaceId); // getter 사용
      console.log(this.$store.getters.getWorkspaceName);
    }
  },
};
</script>

<style lang="scss"></style>
