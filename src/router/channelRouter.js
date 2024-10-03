import ChannelView from "@/views/channel/ChannelView.vue";
import ChannelList from "@/views/channel/ChannelList.vue";

export const channelRouter = [
    {
        path: '/channel/:channelId',
        name: 'ChannelView',
        component: ChannelView,
        props: true
    },
    {
        path: '/channel/view',
        name: 'ChannelView2',
        component: ChannelView,
        props: true
    },  
    {
        path: '/channel/view/:channelId',
        name: 'ChannelView3',
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