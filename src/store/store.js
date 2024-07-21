import {createStore, GetterTree} from 'vuex';

// Create a new store instance.
export const store = {
    state () {
        return {
            count: 0
        }
    },
    getters () {
        return {
            count: (state) => state.count
        }
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
}
