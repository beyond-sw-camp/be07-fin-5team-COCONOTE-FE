function initState(){
    return {
        channelId : null //현 접속한 channelId
    };
}

const channel = {
    state: initState(),
    mutations: {
        setChannelInfo(state, channelValue) {
            state.channelId = channelValue;
        }
    },
    actions: {
        setChannelInfoActions({ commit }, channelValue) {
            commit('setChannelInfo', channelValue);
        }
    },
    getters: {
        getChannelId: state => state.channelId,
    }
}

export default channel;
