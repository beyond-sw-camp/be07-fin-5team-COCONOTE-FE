import ThreadView from "@/views/thread/ThreadView.vue";

export const threadRouter = [
    {
        path: '/channel/:channelId/thread/view',
        name: 'ThreadView',
        component: ThreadView,
        props: true
    },  
]