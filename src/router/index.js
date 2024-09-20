import {createRouter, createWebHistory} from 'vue-router';

import HomePage from '@/views/HomePage.vue';
import { canvasRouter } from './canvasRouter';

const routes = [
    {
        // path로도 라우팅이 가능하고, name으로도 라우팅이 가능
        // name으로 라우팅하는 경우는 js코드내에서 라우팅하는 경우
        path: '/',
        name: 'HOME',
        component: HomePage
    },
    ...canvasRouter,
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;