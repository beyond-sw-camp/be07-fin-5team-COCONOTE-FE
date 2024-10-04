import ThreadView from "@/views/thread/ThreadView.vue";

export const threadRouter = [
    {
        path: '/thread/view/:id',
        name: 'ThreadView',
        component: ThreadView,
        props: true
    },  
    {
        path: '/channel/:channelId/thread/view',
        name: 'ThreadView',
        component: ThreadView,
        props: true
    },
]