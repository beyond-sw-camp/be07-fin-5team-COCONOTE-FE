// driveRouter.js
import FolderComponent from '@/views/drive/DriveView.vue';

export const driveRouter = [
    {
        path: '/channel/:channelId/drive', // URL에서 채널 ID를 받기 위해 :id 사용
        name: 'FolderComponent',
        component: FolderComponent,
        props: true, // 채널 ID를 컴포넌트에 props로 전달
    },
];
