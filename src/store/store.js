import { createStore } from 'vuex'

// Create a new store instance.
export const store = createStore({
    state () {
        return {
            count: 0
        }
    },
    getters: {
        doubleCount (state) {
            return state.count * 2
        }
    },
    mutations: {
        increment (state, n) {
            state.count += n
        }
    }
})
