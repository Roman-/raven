import { createStore } from 'vuex'
import { generateCellsAndAnswers } from "@/js/generator";
import {generateSetOfGrids, generateSetOfGridsMaximumDifficulty} from "@/js/grids";
import {getRandomFlavor} from "@/js/FlavorFactory";

export const store = createStore({
    strict: true,
    state () {
        return {
            difficulty: 1,
            flavor: getRandomFlavor(1),
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
            state.flavor = getRandomFlavor(state.difficulty)
            const numFeatures = Object.keys(state.flavor.getFeaturesVariations()).length;
            const grids = generateSetOfGrids(numFeatures, state.difficulty);

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
        },
        setDifficulty (state, difficulty) {
            state.difficulty = difficulty;
        }
    },
    actions: {
    }
})
