import {createStore} from 'vuex';
import channel from './channel';

const store = createStore({
    modules:{
        channel
    }
});

export default store;