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
      <button @click="moveThread" :class="{ active: menu === 'thread' }">쓰레드</button>
      <button @click="moveCanvas" :class="{ active: menu === 'canvas' }">캔버스</button>
      <button @click="moveDrive" :class="{ active: menu === 'drive' }">드라이브</button>
      <button class="badge">
        2분할 보기 <v-icon icon="mdi-eye-outline" class="eye" />
      </button>
      <button class="invteChannelMember" @click="openChannelMemberInviteModal">멤버 초대</button>
    </div>

    <!-- 모달 컴포넌트 -->
    <ChannelMemberModal v-if="isChannelMemberModalOpen" :channelId="channelId" :workspaceId="getWorkspaceId"
      @closeModal="closeChannelMemberInviteModal" />
  </div>
</template>

<script>
import ChannelMemberModal from '@/components/ChannelMemberInviteModal.vue';  // 모달 컴포넌트 추가
import { mapGetters } from 'vuex';


export default {
  props: ['channelId', 'menu'],
  name: "ChannelCommonMenu",
  components: {
    ChannelMemberModal, // 모달 컴포넌트 등록
  },
  data() {
    return {
      isChannelMemberModalOpen: false,
    };
  },
  computed: {
    ...mapGetters(['getWorkspaceId', 'getWorkspaceName']) // Vuex getter 매핑
  },
  methods: {
    moveThread() {
      this.$router.push(`/channel/${this.channelId}/thread/view`)
    },
    moveCanvas() {
      this.$router.push(`/channel/${this.channelId}/canvas/view`)
    },
    moveDrive() {
      this.$router.push(`/channel/${this.channelId}/drive/view`)
    },
    openChannelMemberInviteModal() {
      this.isChannelMemberModalOpen = true;  // 모달 열기
      console.log('openInviteModal');
    },
    closeChannelMemberInviteModal() {
      this.isChannelMemberModalOpen = false;  // 모달 닫기
      console.log('closeInviteModal');
    }
  }
};
</script>

<style lang="scss">
.channelMenuContainer {
  $gray_font : #A4A4A4;
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
          color: #FFBB00;
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

    .right-buttons {
      display: flex;
      align-items: center;

      .invite-btn {
        margin-left: 16px;
        padding: 4px 12px;
        font-size: 12px;
        background-color: #69a0f2;
        color: white;
        border-radius: 30px;
        border: none;
      }
    }
  }

  .menuBtns {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border-bottom: 1px solid #E6E6E6;
    padding: 0 24px;

    button {
      padding: 8px 16px;
      border-bottom: 1px solid #8B8B8B;
      background: none;
      margin-bottom: -1px;

      &.active {
        border-bottom: 3px solid #69A0F2;
      }

      &.badge {
        margin-left: 8px;
        border-bottom: none;
        font-size: 10px;
        background: #F3F3F3;
        border-radius: 30px;
        border: 1px solid #CECECE;
        padding: 4px 8px;

        .eye {
          color: #919191;
        }
      }
    }
  }
}
</style>
