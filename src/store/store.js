import { createStore } from 'vuex'

export const store = createStore({
    strict: true,
    state () {
        return {
            coins: 9,
            preloadedImageUuids: [ '', '1', '2', '3' ], // first one is fake "upload img"
            originalImage: null, // new Image()
            croppedImageSrc: null,
            pixelWidth: 0,
            pixelHeight: 0,
        }
    },
    getters: {
        twiceCoins (state) {
            return state.coins * 2
        }
    },
    mutations: {
        setImgSrc (state, src, onImageReady) {
            state.originalImage = new Image()
            state.originalImage.crossOrigin = "Anonymous";
            state.originalImage.addEventListener('load', onImageReady);
            state.originalImage.src = src
        },
        setCroppedImg(state, dataUrl, width, height) {
            state.croppedImageSrc = dataUrl
            state.pixelWidth = width
            state.pixelHeight = height
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
