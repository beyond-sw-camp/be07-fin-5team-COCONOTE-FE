<template>
  <div class="channelMenuContainer">
    <div class="top">
      <!-- ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ 여기부터 시작 > 채널별 공통 상단메뉴 -->
      <div class="titleArea ">
        <div>
          <v-icon icon="mdi-star" class="star active" />
        </div>
        <h1>
          # 공지사항
        </h1>
        <div>
          <v-icon icon="mdi-pencil-outline" class="pencil" />
        </div>
      </div>
      <p>
        우리의 공지가 들어갑니다.
      </p>
    </div>
    <div class="menuBtns">
      <button class="active">쓰레드</button>
      <button>캔버스</button>
      <button>드라이브</button>
      <button class="badge">
        2분할 보기 <v-icon icon="mdi-eye-outline" class="eye"/>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChannelCommonMenu",
  components: {},
  data() {
    return {

    };
  },
};
</script>

<style lang="scss">
.channelMenuContainer{
  $gray_font : #A4A4A4;
  padding-top: 24px ;
  .top{
    margin-bottom: 16px;
    padding: 0 24px;
    .titleArea{
      display: flex;
      align-items: center;
      .star{
        color: $gray_font;
        font-size: 24px;
        &.active{
          color: #FFBB00;
        }
      }
      h1{
        font-size: 24px;
        padding: 0 10px;
      }
      .pencil{
        color: $gray_font;
        font-size: 16px;
      }
    }
    p{
      color: $gray_font;
      font-size: 12px;
    }
  }
  .menuBtns{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;
    padding: 0 24px;
    button{
      padding: 8px 16px;
      border-bottom: 1px solid #8B8B8B;
      background: none;
      margin-bottom: -1px;
      &.active{
        border-bottom: 3px solid #69A0F2;
      }
      &.badge{
        margin-left: 8px;
        border-bottom: none;
        font-size: 10px;
        background: #F3F3F3;
        border-radius: 30px;
        border: 1px solid #CECECE;
        padding: 4px 8px;
        .eye{
          color: #919191;
        }
      }
    }
  }
}
</style>
