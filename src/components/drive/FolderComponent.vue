<template>
  <div class="drive-container">
    <div class="toolbar">
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
      folderList: [],
      fileList: [],
      currentFolderId: null,
      files: [], // 업로드할 파일 배열
      uploadProgress: [], // 업로드 진행 상황
    };
  },
  methods: {
    // 폴더 생성
    async createFolder() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/create`, {
          channelId: 1, // 적절한 채널 ID 설정
          parentFolderId: this.currentFolderId,
        });
        alert(response.data.result.message || '폴더 생성 완료');
        this.refreshFolderList();
      } catch (error) {
        console.error('폴더 생성 실패:', error);
        alert('폴더 생성 중 오류가 발생했습니다.');
      }
    },

    // 파일 선택 처리
    onFileChange(event) {
      this.files = Array.from(event.target.files);
      this.uploadProgress = Array(this.files.length).fill(0); // 업로드 진행상황 초기화
    },

    // 파일을 S3에 업로드하는 함수 (첫 번째 방식과 유사)
    async uploadFiles() {
      if (!this.files.length) return;

      try {
        // 서버에 presigned URLs 요청
        const presignedUrlResponse = await axios.post('http://localhost:8080/api/v1/files/presigned-urls', this.files.map(file => ({
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
    // 폴더 삭제 
    async deleteFolder(folderId) {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/drive/folder/${folderId}`);
        alert(response.data.message);
        this.refreshFolderList();
      } catch (error) {
        console.error(error);
      }
    },

    // 폴더 이동
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
      // folderId가 필수라면, 없을 경우 경고 메시지 출력
      if (!this.currentFolderId) {
        alert("폴더를 선택해야 합니다.");
        return;
      }
      const metadataDto = {
        channelId: 1, // 적절한 채널 ID로 수정하세요
        folderId: this.currentFolderId, // 반드시 folderId를 포함하여 전송
        fileType: 'OTHER', // 백엔드에서 필요한 Enum 값 (FileType.THREAD, FileType.CANVAS 등)
        fileSaveListDto: uploadedFileUrls.map((url, index) => ({
          fileName: this.files[index].name, // 원본 파일 이름
          fileUrl: url, // 짧아진 S3 URL
        })), // 파일 메타데이터 리스트
      };

      await axios.post('http://localhost:8080/api/v1/files/metadata', metadataDto);
    },

    // 파일 다운로드
    async downloadFile(fileId) {
      try {
        // presigned URL 가져오기
        const response = await axios.get(`http://localhost:8080/api/v1/files/${fileId}/download`);

        const presignedUrl = response.data.result; // presigned URL 가져오기

        // Blob을 사용하여 파일 다운로드
        const fileResponse = await axios.get(presignedUrl, { responseType: 'blob' });

        // 파일 이름 추출
        const fileName = response.headers['content-disposition']
          ? response.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
          : 'downloaded_file';

        // Blob을 파일로 변환하여 다운로드
        const blob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', fileName); // 서버에서 전달된 파일 이름으로 설정
        document.body.appendChild(link);
        link.click(); // 링크 클릭 이벤트로 다운로드 시작
        document.body.removeChild(link); // 링크 제거
      } catch (error) {
        console.error("파일 다운로드에 실패했습니다.", error);
        alert("파일 다운로드 중 오류가 발생했습니다.");
      }
    },

    // 파일 삭제
    async deleteFile(fileId) {
      try {
        const confirmed = confirm("정말로 이 파일을 삭제하시겠습니까?");
        if (!confirmed) return;

        await axios.delete(`http://localhost:8080/api/v1/files/${fileId}`);
        alert('파일이 성공적으로 삭제되었습니다.');

        // 파일 목록 갱신
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
        await axios.patch('http://localhost:8080/api/v1/files/move', {
          fileId: fileId,
          folderId: newFolderId
        });
        alert('파일이 성공적으로 이동되었습니다.');

        // 파일 목록 갱신
        this.refreshFolderList();
      } catch (error) {
        console.error('파일 이동 실패:', error);
        alert('파일 이동 중 오류가 발생했습니다.');
      }
    },

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

    // 폴더 탐색
    async navigateToFolder(folderId) {
      this.currentFolderId = folderId;
      this.refreshFolderList();
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
