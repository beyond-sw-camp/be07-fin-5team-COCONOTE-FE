// driveRouter.js
import DriveView from '@/views/drive/DriveView.vue';

export const driveRouter = [
    {
        path: '/channel/:channelId/drive/view',
        name: 'DriveView',
        component: DriveView,
        props: true
    },
];
