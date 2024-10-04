<template>
  <div class="channelInsideContainer">
    <ChannelCommonMenu :menu="'canvas'" :channelId="channelId" />
    <div class="channelInsideContentWrap">
      <v-row class="canvasContatiner ma-0">
        <v-col cols="2" class="canvasListContainer pa-0">
          <CanvasListComponent @updateCanvasId="updateCanvasId" />
          <!-- <v-list class="h-100">
            <v-list-item prepend-icon="mdi-home">Home</v-list-item>

            Users 그룹
            <v-list-group v-model="open[0]" value="Users">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-account-circle">
                  Users
                </v-list-item>
              </template>

              Admin 그룹 
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

              Actions 그룹
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
          </v-list> -->
        </v-col>
        <v-col class="canvasDetailContainer pa-0">
          <v-progress-circular
            v-if="isLoading && canvasId == null"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <div v-else-if="canvasId == null">
            <h1>캔버스가 없습니다.</h1>
          </div>
          <CanvasDetailComponent
            v-else
            :canvasId="canvasId"
            :key="canvasId"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ChannelCommonMenu from "@/components/basic/ChannelCommonMenu.vue";
import CanvasListComponent from "@/components/canvas/CanvasListComponent.vue";
import CanvasDetailComponent from "@/components/canvas/CanvasDetailComponent.vue";

export default {
  props: {
      channelId: {
        type: String,
        required: true,
      },
    },
  components: {
    ChannelCommonMenu,
    CanvasListComponent,
    CanvasDetailComponent,
  },
  data() {
    return {
      isLoading: false,
      canvasId: null, // 초기 canvasId 값
    };
  },
  methods: {
    updateCanvasId(newCanvasId) {
      this.isLoading = true;
      console.log("canvasId 변경!", newCanvasId);
      this.canvasId = newCanvasId;
    },
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
  .canvasDetailContainer {
    height: 100%;
    overflow: auto;
  }
}
</style>
