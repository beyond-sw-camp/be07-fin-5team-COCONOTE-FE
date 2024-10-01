<template>
  <div class="drive-container">
    <!-- 현재 경로 표시 -->
    <div class="breadcrumb">
      <span v-for="(folder, index) in breadcrumb" :key="folder.folderId">
        <span @click="navigateToFolder(folder.folderId)" class="breadcrumb-item">
          {{ folder.folderName }}
        </span>
        <span v-if="index !== breadcrumb.length - 1"> / </span> <!-- 마지막 폴더에는 '/' 표시 안함 -->
      </span>
    </div>

    <!-- 뒤로 가기 버튼 -->
    <div class="toolbar">
      <button @click="goBack" :disabled="!backButtonHistory.length">뒤로 가기</button>
      <button @click="createFolder">새 폴더</button>
      <button @click="refreshFolderList">새로고침</button>
      <input type="file" multiple @change="onFileChange" />
      <button @click="uploadFiles" :disabled="!files.length">파일 업로드</button>
    </div>

    <div v-if="uploadProgress.length">
      <h3>업로드 진행상황</h3>
      <ul>
        <li v-for="(progress, index) in uploadProgress" :key="index">
          {{ files[index].name }}: {{ progress }}%
        </li>
      </ul>
    </div>

    <div class="folder-list">
      <div v-for="folder in folderList" :key="folder.folderId" class="folder-item"
        @click="navigateToFolder(folder.folderId)">
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
        <a :href="file.fileUrl" download>{{ file.fileName }}</a>
        <button @click.stop="deleteFile(file.fileId)">삭제</button>
        <button @click.stop="moveFile(file.fileId)">이동</button>
        <button @click.stop="downloadFile(file.fileId)">다운로드</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/services/axios';

export default {
  data() {
    return {
      folderList: [],  // 현재 폴더 내 폴더 목록
      fileList: [],    // 현재 폴더 내 파일 목록
      currentFolderId: null, // 현재 탐색 중인 폴더 ID
      backButtonHistory: [], // 이전 폴더 기록
      files: [], // 업로드할 파일 배열
      uploadProgress: [], // 파일 업로드 진행 상황
      breadcrumb: [] // 폴더 경로를 저장하는 배열
    };
  },
  methods: {
    async loadChannelDrive() {
      const channelId = this.$route.params.id; // URL에서 채널 ID 추출
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/channel/${channelId}/drive`);
        const data = response.data.result;
        this.currentFolderId = data.nowFolderId;
        this.folderList = data.folderListDto || [];
        this.fileList = data.fileListDto || [];
        this.breadcrumb = [{ folderId: this.currentFolderId, folderName: data.nowFolderName }];
      } catch (error) {
        console.error('채널 드라이브 로딩 실패:', error);
        alert('채널 드라이브 로딩 중 오류가 발생했습니다.');
      }
    },

    // 폴더 생성
    async createFolder() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/create`, {
          channelId: 1,
          parentFolderId: this.currentFolderId,
        });
        alert(response.data.result.message || '폴더 생성 완료');
        this.refreshFolderList();
      } catch (error) {
        console.error('폴더 생성 실패:', error);
        alert('폴더 생성 중 오류가 발생했습니다.');
      }
    },

    // 뒤로 가기 기능
    goBack() {
      if (this.backButtonHistory.length) {
        console.log('뒤로 가기:', this.backButtonHistory);
        const previousFolderId = this.backButtonHistory.pop(); // 마지막 폴더 ID를 제거하고 이동
        this.breadcrumb.pop(); // 경로에서 마지막 폴더 제거
        this.navigateToFolder(previousFolderId, false); // false는 뒤로가기 이동 시 기록하지 않기 위함
      }
    },

    // 폴더 탐색
    // async refreshFolderList() {
    //   try {
    //     const folderId = this.currentFolderId || 1; // currentFolderId가 없으면 루트 폴더 ID 사용
    //     const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}`);
    //     this.folderList = response.data.result.folderListDto || [];
    //     this.fileList = response.data.result.fileListDto || [];
    //   } catch (error) {
    //     console.error('폴더/파일 목록 갱신 실패:', error);
    //     alert('목록 갱신 중 오류가 발생했습니다.');
    //   }
    // },

    // 폴더/파일 목록 갱신
    async refreshFolderList() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${this.currentFolderId || 1}`);
        this.folderList = response.data.result.folderListDto || [];
        this.fileList = response.data.result.fileListDto || [];
      } catch (error) {
        console.error('폴더/파일 목록 갱신 실패:', error);
        alert('목록 갱신 중 오류가 발생했습니다.');
      }
    },

    // 파일 선택 처리
    onFileChange(event) {
      this.files = Array.from(event.target.files);
      this.uploadProgress = Array(this.files.length).fill(0); // 업로드 진행상황 초기화
    },

    // 파일 업로드
    async uploadFiles() {
      if (!this.files.length) return;

      try {
        // 서버에 presigned URLs 요청
        const presignedUrlResponse = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/files/presigned-urls`, this.files.map(file => ({
          fileName: file.name,
          fileSize: file.size
        })));

        const presignedUrls = presignedUrlResponse.data.result;

        // 각 파일에 대해 Presigned URL을 이용하여 S3에 업로드
        const uploadedFileUrls = await Promise.all(this.files.map(file => this.uploadFileToS3(file, presignedUrls[file.name])));

        // 파일 중 업로드가 실패한 파일이 있으면 필터링
        const successfulUploads = uploadedFileUrls.filter(url => url !== null);

        // 성공적으로 업로드된 파일만 메타데이터 저장
        if (successfulUploads.length) {
          await this.saveFileMetadata(successfulUploads);
          alert('파일이 성공적으로 업로드되었습니다.');
        } else {
          alert('모든 파일 업로드에 실패했습니다.');
        }

        // 업로드 후 상태 초기화
        this.files = [];
        this.uploadProgress = [];
        this.refreshFolderList();
      } catch (error) {
        console.error('Upload failed:', error);
        alert('파일 업로드 중 오류가 발생했습니다.');
      }
    },

    // S3에 파일 업로드
    async uploadFileToS3(file, presignedUrl) {
      try {
        const config = {
          headers: {
            'Content-Type': file.type, // 파일 타입 지정
          },
          onUploadProgress: (progressEvent) => {
            const index = this.files.indexOf(file); // 인덱스 찾기
            this.uploadProgress[index] = Math.round((progressEvent.loaded * 100) / progressEvent.total); // 업로드 진행상황 업데이트
          },
        };

        await axios.put(presignedUrl, file, config);

        // S3에 업로드된 파일의 URL에서 ? 앞부분만 반환 (쿼리 파라미터 제거)
        return this.extractS3Url(presignedUrl);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        return null; // 업로드 실패 시 null 반환
      }
    },

    // Presigned URL에서 ? 이전의 S3 URL만 남김
    extractS3Url(presignedUrl) {
      return presignedUrl.split('?')[0]; // ? 기준으로 앞부분만 추출
    },

    // 파일 메타데이터 저장
    async saveFileMetadata(uploadedFileUrls) {
      if (!this.currentFolderId) {
        alert("폴더를 선택해야 합니다.");
        return;
      }
      const metadataDto = {
        channelId: 1, // 적절한 채널 ID로 수정
        folderId: this.currentFolderId,
        fileType: 'OTHER',
        fileSaveListDto: uploadedFileUrls.map((url, index) => ({
          fileName: this.files[index].name,
          fileUrl: url,
        })),
      };

      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/files/metadata`, metadataDto);
    },

    // 파일 삭제
    async deleteFile(fileId) {
      try {
        const confirmed = confirm("정말로 이 파일을 삭제하시겠습니까?");
        if (!confirmed) return;

        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/files/${fileId}`);
        alert('파일이 성공적으로 삭제되었습니다.');
        this.refreshFolderList();
      } catch (error) {
        console.error('파일 삭제 실패:', error);
        alert('파일 삭제 중 오류가 발생했습니다.');
      }
    },

    // 파일 이동
    async moveFile(fileId) {
      const newFolderId = prompt("이동할 폴더 ID를 입력하세요:");
      if (!newFolderId) {
        alert("유효한 폴더 ID를 입력하세요.");
        return;
      }

      try {
        await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/files/move`, {
          fileId: fileId,
          folderId: newFolderId
        });
        alert('파일이 성공적으로 이동되었습니다.');
        this.refreshFolderList();
      } catch (error) {
        console.error('파일 이동 실패:', error);
        alert('파일 이동 중 오류가 발생했습니다.');
      }
    },

    // 폴더 삭제
    async deleteFolder(folderId) {
      try {
        const confirmed = confirm("정말로 이 폴더를 삭제하시겠습니까?");
        if (!confirmed) return;

        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}`);
        alert('폴더가 성공적으로 삭제되었습니다.');
        this.refreshFolderList();
      } catch (error) {
        console.error('폴더 삭제 실패:', error);
        alert('폴더 삭제 중 오류가 발생했습니다.');
      }
    },

    // 폴더 이름 변경
    async renameFolder(folderId) {
      const newFolderName = prompt("새 폴더 이름을 입력하세요:");
      if (!newFolderName) {
        alert("유효한 폴더 이름을 입력하세요.");
        return;
      }

      try {
        // 백엔드의 API 경로에 맞춰서 folderId를 URL에 삽입
        await axios.patch(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}/update/name`, null, {
          params: {
            folderName: newFolderName, // 요청 파라미터로 폴더 이름 전달
          },
        });
        alert('폴더 이름이 성공적으로 변경되었습니다.');
        this.refreshFolderList(); // 목록 갱신
      } catch (error) {
        console.error('폴더 이름 변경 실패:', error);
        alert('폴더 이름 변경 중 오류가 발생했습니다.');
      }
    },
    // 폴더 탐색
    async navigateToFolder(folderId, recordHistory = true) {
      if (recordHistory && this.currentFolderId !== folderId) {
        this.backButtonHistory.push(this.currentFolderId); // 현재 폴더 ID를 기록
        const selectedFolder = this.folderList.find(folder => folder.folderId === folderId); // 탐색할 폴더 찾기
        if (selectedFolder) {
          this.breadcrumb.push({
            folderId: selectedFolder.folderId,
            folderName: selectedFolder.folderName,
          });
        }
      }
      this.currentFolderId = folderId;
      await this.refreshFolderList();
    },
  },
  created() {
    // this.currentFolderId = this.currentFolderId || 1;
    this.refreshFolderList();
  },
};
</script>

<style>
.drive-container {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb span {
  cursor: pointer;
  color: blue;
}

.breadcrumb span:hover {
  text-decoration: underline;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.folder-list,
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.folder-item,
.file-item {
  width: 120px;
  text-align: center;
}

.folder-item i,
.file-item i {
  font-size: 24px;
  display: block;
}
</style>
