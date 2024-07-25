import { createStore } from 'vuex'

export const store = createStore({
    strict: true,
    state () {
        return {
            coins: 9,
            preloadedImageUuids: [ '', '1', '2', '3' ], // first one is fake "upload img"
            originalImage: null, // new Image()
            croppedImageSrc: null,
            pixelSize: [0, 0]
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
        setPixelSize(state, widthHeightArray) {
            state.pixelSize = widthHeightArray
        },
        setCroppedImg(state, dataUrl) {
            state.croppedImageSrc = dataUrl
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
