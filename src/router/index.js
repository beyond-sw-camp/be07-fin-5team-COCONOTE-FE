import {createRouter, createWebHistory} from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import OAuth2Success from '@/views/OAuth2Success.vue'; // OAuth2 성공 페이지 컴포넌트
import YourComponent from '@/views/YourComponent.vue'; // 추가된 컴포넌트 경로


import { canvasRouter } from './canvasRouter';
import { threadRouter } from '@/router/threadRouter'
import { channelRouter } from '@/router/channelRouter'

const routes = [
    {
        // path로도 라우팅이 가능하고, name으로도 라우팅이 가능
        // name으로 라우팅하는 경우는 js코드내에서 라우팅하는 경우
        path: '/',
        name: 'HOME',
        component: HomePage
    },
    {
        path: '/login',
        name: 'LOGIN',
        component: LoginPage,
    },
    {
        path: '/oauth2/success',
        name: 'OAuth2Success',
        component: OAuth2Success, // 컴포넌트 경로를 실제 파일로 변경해 주세요.
    },
    {
        path: '/protected', // 원하는 경로 지정
        name: 'ProtectedPage',
        component: YourComponent, // 새로 추가한 컴포넌트
    },
    ...channelRouter,
    ...canvasRouter,
    ...threadRouter,
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;