// Axios 인스턴스를 생성하여 모든 요청에 accessToken을 포함하는 설정을 추가합니다. 
// services 디렉터리 안에 axios.js 파일을 생성하는 것이 일반적입니다.
// src/services/axios.js
import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // 백엔드 API 주소로 변경
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    // S3 URL이 아닌 경우에만 Authorization 헤더 추가
    if (accessToken && !config.url.includes('amazonaws.com')) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (토큰 만료 시 자동 갱신)
apiClient.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;
  
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      const refreshToken = localStorage.getItem('refreshToken');
  
      if (refreshToken) {
        try {
          const response = await axios.post('http://localhost:8080/auth/refresh-token', {
            token: refreshToken,
          });
  
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);  // 새로운 Access Token 저장
  
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;  // 새로운 토큰으로 요청 갱신
          return apiClient(originalRequest);  // 원래 요청 다시 실행
        } catch (refreshError) {
          console.error('토큰 갱신 실패:', refreshError);
          // 여기서 추가로 로그아웃 처리 등 가능
        }
      }
    }
    return Promise.reject(error);
  });

export default apiClient;
