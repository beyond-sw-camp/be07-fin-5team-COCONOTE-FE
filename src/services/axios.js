// src/services/axios.js
import axios from 'axios';

// 요청 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    // console.log('Access Token from localStorage:', accessToken); // 디버깅 로그

    // S3 URL이 아닌 경우에만 Authorization 헤더 추가
    if (accessToken && !config.url.includes('amazonaws.com')) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // console.log('Authorization Header:', config.headers.Authorization); // 디버깅 로그
    }
    // console.log('Final Request Config:', config); // 디버깅 로그

    return config;
  },
  (error) => {
    console.error('Request error:', error); // 에러 로그
    return Promise.reject(error);
  }
);

// 필요 시 응답 인터셉터도 추가할 수 있음
axios.interceptors.response.use(
  (response) => {
    // 응답 성공 시 처리할 로직
    return response;
  },
  (error) => {
    // 응답 에러 처리
    console.error('Response error:', error); // 에러 로그
    return Promise.reject(error);
  }
);

export default axios;
