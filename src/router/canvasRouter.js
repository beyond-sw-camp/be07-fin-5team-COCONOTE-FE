
import CanvasView from "@/views/canvas/CanvasView.vue";

export const canvasRouter = [
    {
        path: '/channel/:channelId/canvas/view',
        name: 'CanvasEmptyView',
        component: CanvasView
    },
    {
        path: '/channel/:channelId/canvas/view/:canvasId',
        name: 'CanvasView',
        component: CanvasView
    },  
]