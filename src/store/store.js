// filename: src/store/store.js
import { createStore } from 'vuex'
import { shapeFlavor } from "@/js/puzzle_flavors/shapeFlavor";
import { gradientsFlavor } from "@/js/puzzle_flavors/gradientsFlavor";
import { generateCellsAndAnswers } from "@/js/generator";
import { generateSetOfGridsMaximumDifficulty } from "@/js/grids";
import {fancyShapeFlavor} from "@/js/puzzle_flavors/fancyShapeFlavor";

export const store = createStore({
    strict: true,
    state () {
        return {
            flavor: fancyShapeFlavor,
            cellsAndAnswers: null,
            numAnswers: 8,

            // New for "interactive" puzzle:
            selectedAnswerIndex: null,
            isAnswerRevealed: false,
        }
    },
    getters: {
        // The 3x3 cells to be drawn in the puzzle
        cells (state) {
            // Safeguard if cellsAndAnswers is null
            return state.cellsAndAnswers?.cells || [];
        },
        answers (state) {
            return state.cellsAndAnswers?.answers || [];
        },
        drawCell (state) {
            return state.flavor.drawCell
        },
        // For clarity, the correct answer is always at index 0 (per generator.js)
        correctAnswerIndex (state) {
            return state.cellsAndAnswers.answers.findIndex(a => a.isAnswer);
        },
        // Helper: did the player pick the correct answer?
        isAnswerCorrect (state, getters) {
            if (state.selectedAnswerIndex == null) return false;
            return state.selectedAnswerIndex === getters.correctAnswerIndex;
        }
    },
    mutations: {
        // Generate a new puzzle
        generate (state) {
            const numFeatures = Object.keys(state.flavor.getFeaturesVariations()).length;
            const grids = generateSetOfGridsMaximumDifficulty(numFeatures);

            // Build puzzle + answers
            state.cellsAndAnswers = generateCellsAndAnswers(
                grids,
                state.flavor,
                state.numAnswers
            );

            // Reset interactive state
            state.selectedAnswerIndex = null;
            state.isAnswerRevealed = false;
        },
        // Player clicked an answer: record it and reveal correctness
        selectAnswer (state, index) {
            // If we only allow one guess, just set once
            state.selectedAnswerIndex = index;
            state.isAnswerRevealed = true;
        }
    },
    actions: {
    }
})
