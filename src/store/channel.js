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
            localStorage.setItem("channelId", channelValue);
        },
        setChannelNameInfo(state, channelNameValue) {
            state.channelName = channelNameValue;
            localStorage.setItem("channelName", channelNameValue);
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
        getChannelId(state){
            let returnState = null;
            returnState = (state.channelId == null) ? localStorage.getItem("channelId") : state.channelId
            if(returnState == null){
                setTimeout(() => {
                    return (state.channelId == null) ? localStorage.getItem("channelId") : state.channelId
                }, 100);
                return false;
            }
            return returnState;
        },
        getChannelName: state => state.channelName,
    }
}

export default channel;

