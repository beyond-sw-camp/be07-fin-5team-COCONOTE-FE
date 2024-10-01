<template>
    <div class="drive-container">
      <div class="toolbar">
        <button @click="createFolder">새 폴더</button>
        <button @click="refreshFolderList">새로고침</button>
      </div>
      <div class="folder-list">
        <div v-for="folder in folderList" :key="folder.folderId" class="folder-item" @click="navigateToFolder(folder.folderId)">
          <i class="folder-icon">📁</i>
          <span>{{ folder.folderName }}</span>
          <button @click.stop="renameFolder(folder.folderId)">이름 변경</button>
          <button @click.stop="deleteFolder(folder.folderId)">삭제</button>
          <button @click.stop="moveFolder(folder.folderId)">이동</button>
        </div>
      </div>
      <div class="file-list">
        <div v-for="file in fileList" :key="file.fileId" class="file-item">
          <i class="file-icon">📄</i>
          <a :href="file.fileUrl">{{ file.fileName }}</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '@/services/axios';
  
  export default {
    data() {
      return {
        folderList: [],
        fileList: [],
        currentFolderId: null,
      };
    },
    methods: {
      async createFolder() {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/create`, {
            channelId: 1,  // 적절한 채널 ID 설정
            parentFolderId: 1, //현재 경로 (폴더 ID) 설정
          });
          alert(response.data.result.message);
          this.refreshFolderList();
        } catch (error) {
          console.error(error);
        }
      },
      async renameFolder(folderId) {
        const newName = prompt('새 폴더 이름을 입력하세요:');
        if (!newName) return;
        
        try {
          const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}/update/name`, null, {
            params: { folderName: newName },
          });
          alert(response.data.message);
          this.refreshFolderList();
        } catch (error) {
          console.error(error);
        }
      },
      async deleteFolder(folderId) {
        try {
          const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}`);
          alert(response.data.message);
          this.refreshFolderList();
        } catch (error) {
          console.error(error);
        }
      },
      async moveFolder(folderId) {
        const parentId = prompt('이동할 폴더의 ID를 입력하세요:');
        if (!parentId) return;
        
        try {
          const response = await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/move`, {
            folderId: folderId,
            parentId: parentId,
          });
          alert(response.data.message);
          this.refreshFolderList();
        } catch (error) {
          console.error(error);
        }
      },
      async navigateToFolder(folderId) {
        this.currentFolderId = folderId;
        this.refreshFolderList();
      },
      async refreshFolderList() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/1`);
          this.folderList = response.data.result.folderListDto;
          this.fileList = response.data.result.fileListDto;
          console.log("aa" + this.folderList);
          
        } catch (error) {
          console.error(error);
        }
      },
    },
    created() {
      this.refreshFolderList();
    },
  };
  </script>
  
  <style>
  .drive-container {
    padding: 20px;
  }
  .toolbar {
    display: flex;
    gap: 10px;
  }
  .folder-list, .file-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
  }
  .folder-item, .file-item {
    width: 100px;
    text-align: center;
  }
  .folder-item i, .file-item i {
    font-size: 24px;
    display: block;
  }
  </style>
  