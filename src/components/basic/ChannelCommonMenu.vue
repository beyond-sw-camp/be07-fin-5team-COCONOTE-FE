<template>
  <div class="channelMenuContainer">
    <div class="top">
      <!-- ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 여기부터 시작 > 채널별 공통 상단메뉴 -->
      <div class="titleArea">
        <div>
          <v-icon icon="mdi-star" class="star active" />
        </div>
        <h1># 공지사항</h1>
        <div>
          <v-icon icon="mdi-pencil-outline" class="pencil" />
        </div>
      </div>
      <p>우리의 공지가 들어갑니다.</p>
    </div>
    <div class="menuBtns">
      <button @click="moveMenu('thread')" :class="{ active: menu === 'thread' }" >쓰레드</button>
      <button @click="moveMenu('canvas')" :class="{ active: menu === 'canvas' }" >캔버스</button>
      <button @click="moveMenu('drive')" :class="{ active: menu === 'drive' }" >드라이브</button>
      <button class="badge">
        2분할 보기 <v-icon icon="mdi-eye-outline" class="eye" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['menu'],
  name: "ChannelCommonMenu",
  components: {},
  computed: {
    ...mapGetters(['getChannelId', 'getChannelName'])
  },
  data() {
    return {};
  },
  methods:{
    moveMenu(name){
      this.$router.push(`/channel/${this.$store.getters.getChannelId}/${name}/view`)
    },
  }
};
</script>

<style lang="scss">
.channelMenuContainer {
  $gray_font: #a4a4a4;
  padding-top: 24px;
  .top {
    margin-bottom: 16px;
    padding: 0 24px;
    .titleArea {
      display: flex;
      align-items: center;
      .star {
        color: $gray_font;
        font-size: 24px;
        &.active {
          color: #ffbb00;
        }
      }
      h1 {
        font-size: 24px;
        padding: 0 10px;
      }
      .pencil {
        color: $gray_font;
        font-size: 16px;
      }
    }
    p {
      color: $gray_font;
      font-size: 12px;
    }
  }
  .menuBtns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 24px;
    button {
      padding: 8px 16px;
      border-bottom: 1px solid #8b8b8b;
      background: none;
      margin-bottom: -1px;
      &.active {
        border-bottom: 3px solid #69a0f2;
      }
      &.badge {
        margin-left: 8px;
        border-bottom: none;
        font-size: 10px;
        background: #f3f3f3;
        border-radius: 30px;
        border: 1px solid #cecece;
        padding: 4px 8px;
        .eye {
          color: #919191;
        }
      }
    }
  }
}
</style>
