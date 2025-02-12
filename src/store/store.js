import { createStore } from 'vuex'

// 'coins' is just for example
export const store = createStore({
    strict: true,
    state () {
        return {
            coins: 9,
        }
    },
    getters: {
        twiceCoins (state) {
            return state.coins * 2
        }
    },
    mutations: {
        setCoins (state, amount) {
            state.coins = amount
        },
    },
    actions: {
    }
})
