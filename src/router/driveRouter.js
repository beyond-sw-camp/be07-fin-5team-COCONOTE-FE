// driveRouter.js
import FolderComponent from '@/components/drive/FolderComponent.vue';
import DriveView from '@/views/drive/DriveView.vue';

export const driveRouter = [
    {
        path: '/channel/:id/drive', // URL에서 채널 ID를 받기 위해 :id 사용
        name: 'FolderComponent',
        component: FolderComponent,
        props: true, // 채널 ID를 컴포넌트에 props로 전달
    },
    {
        path: '/channel/:channelId/drive/view',
        name: 'DriveView',
        component: DriveView,
        props: true
    },
];
