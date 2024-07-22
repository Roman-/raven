import { createStore } from 'vuex'

// Create a new store instance.
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
        decrementCoins (state) {
            state.coins--
        }
    },
    actions: {
        updateFromDb (context) {
            setTimeout(() => {
                context.commit('setCoins', 99)
            }, 1000)
        }
    }
})
