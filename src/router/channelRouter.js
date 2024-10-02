import ChannelView from "@/views/channel/ChannelView.vue";
import ChannelList from "@/views/channel/ChannelList.vue";

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
    {
        path: '/channel/list',
        name: 'ChannelList',
        component: ChannelList,
        props: true
    },
    
]