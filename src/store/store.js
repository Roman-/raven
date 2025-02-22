import { createStore } from 'vuex'
import {shapeFlavor} from "@/js/puzzle_flavors/shapeFlavor";
import {generateCellsAndAnswers} from "@/js/generator";
import {generateSetOfGridsMaximumDifficulty} from "@/js/grids";

// 'coins' is just for example
export const store = createStore({
    strict: true,
    state () {
        return {
            flavor: shapeFlavor,
            cellsAndAnswers: null,
            numAnswers: 6,
        }
    },
    getters: {
        cells (state) {
            return state.cellsAndAnswers.cells
        },
        answers (state) {
            return state.cellsAndAnswers.answers
        },
        drawShapeFunction (state) {
            return state.flavor.drawCell
        }
    },
    mutations: {
        generate (state) {
            const numFeatures = Object.keys(state.flavor.getFeaturesVariations()).length;
            const grids = generateSetOfGridsMaximumDifficulty(numFeatures);
            state.cellsAndAnswers = generateCellsAndAnswers(grids, state.flavor, state.numAnswers);
        },
    },
    actions: {
    }
})
