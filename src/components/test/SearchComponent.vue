<template>
    <div class="search-page">
      <!-- 검색 창 -->
      <div class="search-bar">
        <input 
          v-model="keyword" 
          @keyup.enter="search" 
          placeholder="검색어를 입력하세요" 
          class="search-input"
        />
        <button @click="search" class="search-button">검색</button>
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
  
      <!-- 필터 버튼 -->
      <div class="filter-bar">
        <button>From</button>
        <button>In</button>
        <button>내 채널만</button>
        <button>자동화 제외</button>
        <button>필터</button>
      </div>
  
      <!-- 검색 결과 표시 -->
      <div v-if="loading">Loading...</div>
  
      <div v-if="!loading && results.length > 0">
        <h3>Search Results:</h3>
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
    data() {
      return {
        keyword: '',
        activeTab: 'ALL', // 기본값은 'ALL'
        results: [],
        loading: false,
        currentPage: 1,
        totalPages: 1,
        pageSize: 20, // 페이지 당 결과 수
  
        // 카운트 값 초기화
        allCount: 0,
        memberCount: 0,
        fileCount: 0,
        channelCount: 0,
        threadCount: 0,
        canvasBlockCount: 0
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
              workspaceId: 19,  // 예시 workspaceId 값
              keyword: this.keyword,
              target: this.activeTab.toUpperCase(), // 선택한 탭을 전달
              page: this.currentPage - 1, // Spring Data는 0-based 페이지 넘버를 사용
              size: this.pageSize
            }
          });
  
          if (response.data && response.data.result) {
            this.results = response.data.result; // API의 result 필드 사용
            this.totalPages = response.data.totalPages || 1; // 필요하다면 totalPages를 설정
  
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
  
  .filter-bar {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }
  
  .filter-bar button {
    padding: 10px;
    background-color: #4a4a4a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .results {
    background-color: #3a3a3a;
    padding: 20px;
    border-radius: 8px;
  }
  
  .no-results-container {
    text-align: center;
    padding: 50px;
  }
  
  .no-results {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  
  .suggestion {
    font-size: 1em;
    color: #999;
  }
  </style>
  