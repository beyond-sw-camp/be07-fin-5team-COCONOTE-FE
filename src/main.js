import { createApp } from 'vue'
import App from './App.vue'
// 기본 폰트 pretendard
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@/assets/css/global.css';

import router from '@/router/index.js';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
// import axios from 'axios';
import store from './store/index.js';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);

// Vue 애플리케이션 마운트
app.mount('#app');