import ChannelView from "@/views/channel/ChannelView.vue";

export const channelRouter = [
    {
        path: '/channel/view',
        name: 'ChannelView',
        component: ChannelView,
        props: true
    },  
    {
        path: '/channel/view/:id',
        name: 'ChannelView',
        component: ChannelView,
        props: true
    },  
]