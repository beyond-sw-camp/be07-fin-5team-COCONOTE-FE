<template>
  <div class="channelInsideContainer">
    <ChannelCommonMenu />
    <div class="channelInsideContentWrap">
      <v-row class="canvasContatiner ma-0">
        <v-col cols="2" class="canvasListContainer pa-0">
          <v-list class="h-100">
            <v-list-item prepend-icon="mdi-home">Home</v-list-item>

            <!-- Users 그룹 -->
            <v-list-group v-model="open[0]" value="Users">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-account-circle">
                  Users
                </v-list-item>
              </template>

              <!-- Admin 그룹 -->
              <v-list-group v-model="open[1]" value="Admin">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props"> Admin </v-list-item>
                </template>

                <v-list-item
                  v-for="([title, icon], i) in admins"
                  :key="i"
                  :prepend-icon="icon"
                >
                  {{ title }}
                </v-list-item>
              </v-list-group>

              <!-- Actions 그룹 -->
              <v-list-group v-model="open[2]" value="Actions">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props"> Actions </v-list-item>
                </template>

                <v-list-item
                  v-for="([title, icon], i) in cruds"
                  :key="i"
                  :prepend-icon="icon"
                >
                  {{ title }}
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </v-col>
        <v-col class="canvasDetailContainer pa-0">이얍 캔버스 내요옹</v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";

export default {
  components: {
    ChannelCommonMenu,
  },
  data() {
    return {
      open: [true, false, false], // Users 그룹만 기본적으로 열림
      admins: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
      cruds: [
        ["Create", "mdi-plus-outline"],
        ["Read", "mdi-file-outline"],
        ["Update", "mdi-update"],
        ["Delete", "mdi-delete"],
      ],
    };
  },
};
</script>

<style lang="scss">
.canvasContatiner {
  height: 100%;

  .canvasListContainer {
    display: flex;
    flex-direction: column;
    height: 100%;
    > * {
      background: #f7f7f7;
    }
    .v-list-item__content {
      overflow: visible;
    }
  }
}
</style>
