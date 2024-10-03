<template>
  <div class="search-page">
    <!-- 검색 창 -->
    <div class="search-bar">
      <input v-model="keyword" @input="fetchAutocomplete" @keyup.enter="search" placeholder="검색어를 입력하세요"
        class="search-input" />
      <button @click="search" class="search-button">검색</button>
    </div>

    <!-- 자동완성 리스트 -->
    <div v-if="autocompleteSuggestions.length > 0" class="autocomplete-suggestions">
      <ul>
        <li v-for="suggestion in autocompleteSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <!-- 상단 탭 -->
    <div class="tabs">
      <div class="tab" :class="{ active: activeTab === 'ALL' }" @click="setTab('ALL')">
        전체 ({{ totalAll }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'MEMBER' }" @click="setTab('MEMBER')">
        멤버 ({{ totalMembers }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'FILE' }" @click="setTab('FILE')">
        파일 ({{ totalFiles }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'CHANNEL' }" @click="setTab('CHANNEL')">
        채널 ({{ totalChannels }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'THREAD' }" @click="setTab('THREAD')">
        쓰레드 ({{ totalThreads }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'CANVAS_BLOCK' }" @click="setTab('CANVASBLOCK')">
        캔버스 & 블록 ({{ totalCanvasBlocks }})
      </div>
    </div>

    <!-- 검색 결과 표시 -->
    <div v-if="loading" class="loading-message">Loading...</div>

    <div v-if="!loading" class="result-container">
      <!-- 전체 검색 시 모든 카테고리 결과 출력 -->
      <template v-if="activeTab === 'ALL'">
        <div v-if="totalMembers > 0" class="category-section">
          <h3>멤버 검색 결과 ({{ totalMembers }})</h3>
          <div v-for="(result, index) in results.workspaceMembers" :key="index" class="result-card">
            <h3>{{ result.memberName || '멤버 이름 없음' }}</h3>
            <p>{{ result.email || '이메일 없음' }}</p>
          </div>
        </div>

        <div v-if="totalFiles > 0" class="category-section">
          <h3>파일 검색 결과 ({{ totalFiles }})</h3>
          <div v-for="(result, index) in results.files" :key="index" class="result-card">
            <h3>{{ result.fileName || '파일 이름 없음' }}</h3>
            <p><a :href="result.fileUrl" target="_blank">Download</a></p>
          </div>
        </div>

        <div v-if="totalChannels > 0" class="category-section">
          <h3>채널 검색 결과 ({{ totalChannels }})</h3>
          <div v-for="(result, index) in results.channels" :key="index" class="result-card">
            <h3>{{ result.channelName || '채널 이름 없음' }}</h3>
            <p>{{ result.channelInfo || '채널 정보 없음' }}</p>
          </div>
        </div>

        <div v-if="totalThreads > 0" class="category-section">
          <h3>쓰레드 검색 결과 ({{ totalThreads }})</h3>
          <div v-for="(result, index) in results.threads" :key="index" class="result-card">
            <h3>{{ result.content || '내용 없음' }}</h3>
            <p class="metadata">Posted by: {{ result.memberName }} | {{ result.createdTime }}</p>
          </div>
        </div>

        <div v-if="totalCanvasBlocks > 0" class="category-section">
          <h3>캔버스 & 블록 검색 결과 ({{ totalCanvasBlocks }})</h3>
          <div v-for="(result, index) in results.canvasBlocks" :key="index" class="result-card">
            <h3>{{ result.canvasTitle || '제목 없음' }} (Canvas & Block)</h3>
            <p>{{ result.blockContents || '내용 없음' }}</p>
          </div>
        </div>
      </template>

      <!-- 카테고리별 검색 결과 -->
      <template v-else>
        <div v-for="(result, index) in results" :key="index" class="result-card">
          <template v-if="activeTab === 'CANVAS_BLOCK'">
            <h3>{{ result.canvasTitle || '제목 없음' }} (Canvas & Block)</h3>
            <p>{{ result.blockContents || '내용 없음' }}</p>
          </template>
          <template v-else-if="activeTab === 'CHANNEL'">
            <h3>{{ result.channelName || '채널 이름 없음' }}</h3>
            <p>{{ result.channelInfo || '채널 정보 없음' }}</p>
          </template>
          <template v-else-if="activeTab === 'FILE'">
            <h3>{{ result.fileName || '파일 이름 없음' }}</h3>
            <p><a :href="result.fileUrl" target="_blank">Download</a></p>
          </template>
          <template v-else-if="activeTab === 'THREAD'">
            <h3>{{ result.content || '내용 없음' }}</h3>
            <p class="metadata">Posted by: {{ result.memberName }} | {{ result.createdTime }}</p>
          </template>
          <template v-else-if="activeTab === 'MEMBER'">
            <h3>{{ result.memberName || '멤버 이름 없음' }}</h3>
            <p>{{ result.email || '이메일 없음' }}</p>
          </template>
        </div>
      </template>

      <!-- 페이징 -->
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div v-if="!loading && results.length === 0" class="no-results-message">No results found.</div>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce'; 

export default {
  props: ['workspaceId'],
  data() {
    return {
      keyword: '',
      results: {
        workspaceMembers: [],
        files: [],
        channels: [],
        threads: [],
        canvasBlocks: [],
      },
      autocompleteSuggestions: [],
      loading: false,
      currentPage: 1,
      totalPages: 1,
      pageSize: 20,
      activeTab: 'ALL',

      // 각 카테고리별 검색 결과 총 개수
      totalAll: 0,
      totalMembers: 0,
      totalFiles: 0,
      totalChannels: 0,
      totalThreads: 0,
      totalCanvasBlocks: 0,
    };
  },
  created() {
    // Debounce 처리된 자동완성 함수 설정
    this.fetchAutocomplete = debounce(this.fetchAutocomplete, 300);
  },
  methods: {
    async search() {
      this.loading = true;
      this.resetResults();

      let url = `${process.env.VUE_APP_API_BASE_URL}/search`;
      if (this.activeTab !== 'ALL') {
        // 각 카테고리별로 요청할 URL 설정
        url += `/${this.activeTab.toLowerCase()}s`;
      }

      try {
        const response = await axios.get(url, {
          params: {
            workspaceId: this.workspaceId,
            keyword: this.keyword,
            page: this.currentPage - 1, // 0-based 페이지
            size: this.pageSize,
          }
        });

        if (response.data && response.data.result) {
          // 전체 검색일 경우 결과를 카테고리별로 저장
          if (this.activeTab === 'ALL') {
            this.results = response.data.result;
            this.totalMembers = response.data.result.totalMembers || 0;
            this.totalFiles = response.data.result.totalFiles || 0;
            this.totalChannels = response.data.result.totalChannels || 0;
            this.totalThreads = response.data.result.totalThreads || 0;
            this.totalCanvasBlocks = response.data.result.totalCanvasBlocks || 0;
            this.totalAll = this.totalMembers + this.totalFiles + this.totalChannels + this.totalThreads + this.totalCanvasBlocks;

          } else {
            // 카테고리별 검색일 경우 results 배열에 결과 저장
            this.results = response.data.result.results || [];
            this.totalPages = Math.ceil(response.data.result.total / this.pageSize);
          }
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        this.loading = false;
      }
    },

    // 자동완성 데이터 가져오기
    async fetchAutocomplete() {
      if (this.keyword.length < 2) {
        this.autocompleteSuggestions = [];
        return;
      }

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/autocomplete`, {
          params: {
            workspaceId: this.workspaceId,
            keyword: this.keyword,
            target: this.activeTab.toUpperCase(),
          }
        });

        this.autocompleteSuggestions = response.data?.result || [];
      } catch (error) {
        console.error('Autocomplete failed:', error);
        this.autocompleteSuggestions = [];
      }
    },

    selectSuggestion(suggestion) {
      this.keyword = suggestion;
      this.autocompleteSuggestions = [];
      this.search();
    },

    setTab(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
      this.search();
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.search();
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.search();
      }
    },

    resetResults() {
      this.results = {
        workspaceMembers: [],
        files: [],
        channels: [],
        threads: [],
        canvasBlocks: [],
      };
    },
  }
};
</script>

<style scoped>
/* 스크롤 추가 */
.result-container {
  max-height: 600px;
  overflow-y: auto;
}

.autocomplete-suggestions {
  background-color: #671919;
  border: 1px solid #ddd;
  position: absolute;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
}

.autocomplete-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.autocomplete-suggestions li {
  padding: 8px;
  cursor: pointer;
}

.autocomplete-suggestions li:hover {
  background-color: #aa5555;
}

.search-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #616161;
  color: white;
}

.result-card {
  background-color: #333;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-message,
.no-results-message {
  text-align: center;
  font-size: 1.2em;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 10px;
  background-color: #5a5a5a;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination span {
  color: #aaa;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 10px;
  background-color: #444;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.tab.active {
  background-color: #8a8a8a;
}

.category-section {
  margin-bottom: 30px;
}
</style>
