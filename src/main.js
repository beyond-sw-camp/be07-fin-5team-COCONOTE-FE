import { createApp } from 'vue'
import App from './App.vue'
// 기본 폰트 pretendard
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@/assets/css/global.scss';

import router from '@/router/index.js';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
// import axios from 'axios';
import store from './store/index.js';
import axios from 'axios';

const app = createApp(App);

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => response,
    async error => {
        const token = localStorage.getItem("accessToken");
        if (error.response && error.response.status === 401 && token!=null) {
            try {
                localStorage.clear();
                alert("토큰이 만료되었습니다 재로그인 해주세요!!")
                window.location.href = "/login";
            } catch (e) {
                console.log(e.response);
            }
        }
        return Promise.reject(error);
    }
);

app.use(store);
app.use(router);
app.use(vuetify);

// Vue 애플리케이션 마운트
app.mount('#app');