function initState() {
    return {
        workspaceId: null, //현 접속한 workspaceId
        workspaceName: null,
    };
}

const workspace = {
    state: initState(),
    mutations: {
        setWorkspaceInfo(state, workspaceValue) {
            state.workspaceId = workspaceValue;
            localStorage.setItem("workspaceId", workspaceValue);
        },
        setWorkspaceNameInfo(state, workspaceNameValue) {
            state.workspaceName = workspaceNameValue;
            localStorage.setItem("workspaceName", workspaceNameValue);
        }
    },
    actions: {
        setWorkspaceInfoActions({ commit }, workspaceValue) {
            commit('setWorkspaceInfo', workspaceValue);
        },
        setWorkspaceNameInfoActions({ commit }, workspaceNameValue) {
            commit('setWorkspaceNameInfo', workspaceNameValue);
        }
    },
    getters: {
        getWorkspaceId: state => (state.workspaceId == null) ? localStorage.getItem("workspaceId") : state.workspaceId,
        getWorkspaceName: state => (state.workspaceName == null) ? localStorage.getItem("workspaceName") : state.workspaceName,
    }
}

export default workspace;

