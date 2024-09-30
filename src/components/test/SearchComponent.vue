<template>
  <div class="search-page">
    <!-- 검색 창 -->
    <div class="search-bar">
      <input 
        v-model="keyword" 
        @input="fetchAutocomplete"  
        @keyup.enter="search" 
        placeholder="검색어를 입력하세요" 
        class="search-input"
      />
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
        전체 ({{ allCount }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'MEMBER' }" @click="setTab('MEMBER')">
        멤버 ({{ memberCount }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'FILE' }" @click="setTab('FILE')">
        파일 ({{ fileCount }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'CHANNEL' }" @click="setTab('CHANNEL')">
        채널 ({{ channelCount }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'THREAD' }" @click="setTab('THREAD')">
        쓰레드 ({{ threadCount }})
      </div>
      <div class="tab" :class="{ active: activeTab === 'CANVAS_BLOCK' }" @click="setTab('CANVAS_BLOCK')">
        캔버스 & 블록 ({{ canvasBlockCount }})
      </div>
    </div>

    <!-- 검색 결과 표시 -->
    <div v-if="loading">Loading...</div>

    <div v-if="!loading && results.length > 0">
      <ul>
        <li v-for="(result, index) in results" :key="index">
          <pre>{{ result }}</pre>
        </li>
      </ul>

      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>

    <div v-if="!loading && results.length === 0">No results found.</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['workspaceId'],  // workspaceId를 props로 받아옴
  data() {
    return {
      keyword: '',
      results: [],
      autocompleteSuggestions: [],  // 자동완성 제안 리스트
      loading: false,
      currentPage: 1,
      totalPages: 1,
      pageSize: 20, // 페이지 당 결과 수
      activeTab: 'ALL', // 기본값은 'ALL'

      // 카운트 값 초기화
      allCount: 0,
      memberCount: 0,
      fileCount: 0,
      channelCount: 0,
      threadCount: 0,
      canvasBlockCount: 0,
    };
  },
  methods: {
    // 검색 함수
    async search() {
      this.loading = true;
      this.results = [];

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/search`, {
          params: {
            workspaceId: this.workspaceId,  // URL에서 받은 workspaceId 사용
            keyword: this.keyword,
            target: this.activeTab.toUpperCase(), // SearchTarget을 소문자로 변환하여 서버로 전달
            page: this.currentPage - 1, // Spring Data는 0-based 페이지 넘버를 사용
            size: this.pageSize
          }
        });

        if (response.data && response.data.result) {
          this.results = response.data.result; // API의 result 필드 사용
          this.totalPages = response.data.totalPages || 1;

          // 각 카운트 업데이트
          this.allCount = response.data.totalAll || 0;
          this.memberCount = response.data.totalMembers || 0;
          this.fileCount = response.data.totalFiles || 0;
          this.channelCount = response.data.totalChannels || 0;
          this.threadCount = response.data.totalThreads || 0;
          this.canvasBlockCount = response.data.totalCanvasBlocks || 0;
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
            workspaceId: this.workspaceId,  // URL에서 받은 workspaceId 사용
            keyword: this.keyword,
            target: this.activeTab.toUpperCase() // SearchTarget을 소문자로 변환하여 서버로 전달
          }
        });
        console.log("test")
        console.log(response.data.result)

        if (response.data) {
          this.autocompleteSuggestions = response.data.result || [];
        }
      } catch (error) {
        console.error('Autocomplete failed:', error);
      }
    },

    // 자동완성 항목 선택 시 검색어로 설정
    selectSuggestion(suggestion) {
      // this.keyword = suggestion;
      // this.autocompleteSuggestions = [];  // 선택 후 리스트 제거
      // this.search();  // 선택 후 검색 실행
      // 만약 suggestion이 객체라면 특정 필드 사용 (예: suggestion.name)
      if (typeof suggestion === 'object') {
        console.log("sug" + suggestion.nickname)
        this.keyword = suggestion.nickname;  // 객체에서 특정 필드를 검색어로 설정
      } else {
        this.keyword = suggestion;  // 기본적으로 문자열로 처리
      }
  
      this.autocompleteSuggestions = [];  // 선택 후 리스트 제거
      this.search();  // 선택 후 검색 실행
    },

    // 탭 변경 시 검색
    setTab(tab) {
      this.activeTab = tab;
      this.search();
    },

    // 다음 페이지로 이동
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.search();
      }
    },

    // 이전 페이지로 이동
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.search();
      }
    }
  }
};
</script>

<style scoped>
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
  color: white;
  background-color: #2C2C2C;
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #5a5a5a;
  background-color: #333;
  color: white;
  margin-right: 10px;
}

.search-button {
  padding: 10px 20px;
  background-color: #5a5a5a;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #3a3a3a;
  padding: 10px;
  border-radius: 8px;
}

.tab {
  padding: 10px 20px;
  background-color: #5a5a5a;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.tab.active {
  background-color: #8a8a8a;
}

.results {
  background-color: #3a3a3a;
  padding: 20px;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  background-color: #5a5a5a;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
