import { createStore } from 'vuex'

// Create a new store instance.
export const store = createStore({
    state () {
        return {
            coins: 9,
        }
    },
    getters: {
    },
    mutations: {
        decrementCoins (state) {
            state.coins--
        }
    }
})
