import { createStore } from 'vuex'

export const store = createStore({
    strict: true,
    state () {
        return {
            coins: 9,
            preloadedImageUuids: [ '', '1', '2', '3' ], // first is fake "upload img"
            originalImage: null, // uncropped; new Image()
        }
    },
    getters: {
        twiceCoins (state) {
            return state.coins * 2
        }
    },
    mutations: {
        choosePicture(state, pic) {

        },
        setCoins (state, amount) {
            state.coins = amount
        },
        decrementCoins (state) {
            state.coins--
        }
    },
    actions: {
    }
})
