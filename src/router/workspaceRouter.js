import WorkspaceSearchView from "@/views/workspace/WorkspaceSearchView.vue";

export const workspaceRouter = [
    {
        path: '/workspace',
        name: 'WorkspaceSearchView',
        component: WorkspaceSearchView,
        meta: { showHeaderAndSidebar: false },
        props: true
    },  
]