function initState(){
    return {
        channelId : null, //현 접속한 channelId
        channelName : null,
    };
}

const channel = {
    state: initState(),
    mutations: {
        setChannelInfo(state, channelValue) {
            state.channelId = channelValue;
        },
        setChannelNameInfo(state, channelNameValue) {
            state.channelName = channelNameValue;
        }
    },
    actions: {
        setChannelInfoActions({ commit }, channelValue) {
            commit('setChannelInfo', channelValue);
        },
        setChannelNameInfoActions({ commit }, channelNameValue) {
            commit('setChannelNameInfo', channelNameValue);
        }
    },
    getters: {
        getChannelId: state => state.channelId,
        getChannelName: state => state.channelName,
    }
}

export default channel;

