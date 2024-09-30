import CanvasList from "@/views/canvas/CanvasList.vue";
import CanvasDetail from "@/views/canvas/CanvasDetail.vue";
import CanvasView from "@/views/canvas/CanvasView.vue";

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
    {
        path: '/canvas/view/',
        name: 'CanvasView',
        component: CanvasView
    },  
    {
        path: '/canvas/view/:id',
        name: 'CanvasView',
        component: CanvasView
    },  
]