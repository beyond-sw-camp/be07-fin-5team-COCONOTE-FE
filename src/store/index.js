import {createStore} from 'vuex';
import channel from './channel';
import workspace from './workspace';

const store = createStore({
    modules:{
        channel,
        workspace
    }
});

export default store;