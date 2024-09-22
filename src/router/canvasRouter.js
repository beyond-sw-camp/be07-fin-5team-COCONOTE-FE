import CanvasList from "@/views/canvas/CanvasList.vue";
import CanvasDetail from "@/views/canvas/CanvasDetail.vue";

export const canvasRouter = [
    {
        path: '/canvas/list',
        name: 'CanvasList',
        component: CanvasList
    },
    {
        path: '/canvas/detail',
        name: 'CanvasDetail',
        component: CanvasDetail
    },  
]