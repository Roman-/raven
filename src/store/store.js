import { createStore } from 'vuex'
import { generateCellsAndAnswers } from "@/js/generator";
import { generateSetOfGrids } from "@/js/grids";
import { allFlavors, getRandomFlavor } from "@/js/FlavorFactory";

export const store = createStore({
    strict: true,
    state () {
        return {
            difficulty: 2,
            selectedFlavors: [ ...allFlavors ].filter(f => !f.isArtistic),
            flavor: null,
            cellsAndAnswers: null,
            numAnswers: 8,
            randomSeed: 1,

            selectedAnswerIndex: null,
            isAnswerRevealed: false,
        }
    },
    getters: {
        cells (state) {
            return state.cellsAndAnswers?.cells || [];
        },
        answers (state) {
            return state.cellsAndAnswers?.answers || [];
        },
        drawCell (state) {
            return state.flavor?.drawCell;
        },
        correctAnswerIndex (state) {
            return state.cellsAndAnswers?.answers.findIndex(a => a.isAnswer) ?? -1;
        },
        isAnswerCorrect (state, getters) {
            if (state.selectedAnswerIndex == null) return false;
            return state.selectedAnswerIndex === getters.correctAnswerIndex;
        },
        randomSeed (state) {
            return state.randomSeed;
        }
    },
    mutations: {
        generate (state) {
            state.selectedAnswerIndex = null;
            state.isAnswerRevealed = false;
            state.randomSeed++;

            // Generate puzzle only from selected flavors:
            state.flavor = getRandomFlavor(state.selectedFlavors, state.difficulty);
            if (!state.flavor) {
                state.cellsAndAnswers = null;
                return;
            }
            const numFeatures = Object.keys(state.flavor.getFeaturesVariations()).length;
            const grids = generateSetOfGrids(numFeatures, state.difficulty);

            state.cellsAndAnswers = generateCellsAndAnswers(
                grids,
                state.flavor,
                state.numAnswers
            );
        },
        selectAnswer (state, index) {
            state.selectedAnswerIndex = index;
            state.isAnswerRevealed = true;
        },
        setDifficulty (state, difficulty) {
            state.difficulty = difficulty;
        },

        // (Optional) Some helper mutations if you want them:
        selectAllFlavors (state) {
            state.selectedFlavors = [...allFlavors];
        },
        selectNoFlavors (state) {
            state.selectedFlavors = [];
        },
        toggleFlavor (state, flavor) {
            const idx = state.selectedFlavors.indexOf(flavor);
            if (idx > -1) {
                // remove it from array
                state.selectedFlavors.splice(idx, 1);
            } else {
                // add it
                state.selectedFlavors.push(flavor);
            }
        }
    },
    actions: {}
});
