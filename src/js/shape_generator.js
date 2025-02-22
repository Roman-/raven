import {randomElement, shuffle, threeRandomElements} from '@/js/helpers'

export class ShapeGenerator {
    // Static description of features and their possible variations
    static FEATURES_DESCRIPTION = {
        color: ["#DCD7C9", "#A27B5C", "#3F4F44"],
        shape: ["circle", "triangle", "square", "pentagon"],
        lineThickness: [5, 10, 20],
        lineColor: ["#C63C51", "#8C3061", "#522258"]
    }

    /// @param {Array} grids - An array of 2D grids (3x3), each grid corresponds to a feature.
    generate(grids, numAnswers) {
        shuffle(grids) // assign different grids for properties in each puzzle
        const featureNames = Object.keys(ShapeGenerator.FEATURES_DESCRIPTION)
        if (grids.length !== featureNames.length) {
            throw new Error(`Expected ${featureNames.length} grids, got ${grids.length}`)
        }

        // Each grid only has values 0,1,2. Substitute them with the feature's descriptions.
        // chosenVariationsForFeature: { 'color' -> ["blue", "green", "red"] , 'shape' -> ['circle', ...] etc.}
        const chosenVariationsForFeature = {}
        for (const feature of featureNames) {
            chosenVariationsForFeature[feature] = threeRandomElements(ShapeGenerator.FEATURES_DESCRIPTION[feature])
        }

        // Build the puzzle as a 3x3 array of cell objects
        const puzzle = []
        for (let row = 0; row < 3; row++) {
            puzzle[row] = []
            for (let col = 0; col < 3; col++) {
                const cell = {}
                // For each feature, pick from chosenVariationsForFeature based on grids[featureIndex][row][col]
                featureNames.forEach((feature, featureIndex) => {
                    const gridValue = grids[featureIndex][row][col] // 0,1,2
                    cell[feature] = chosenVariationsForFeature[feature][gridValue]
                })
                cell.isAnswer = false
                puzzle[row][col] = cell
            }
        }

        let answerCell = puzzle[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 3)]
        answerCell.isAnswer = true

        // Build the answers array. The first one is the correct answer.
        const answers = [ answerCell ]

        // We create the remaining (numAnswers - 1) "distractors".
        for (let i = 1; i < numAnswers; i++) {
            const distractor = {}
            featureNames.forEach(feature => {
                const usedVariations = chosenVariationsForFeature[feature]
                const correctValue = answerCell[feature]
                // We want to pick a different variation from the correct one if possible.
                // Because we have exactly 3 active variations, remove the correct one and choose random among the other 2.
                const variationOptions = usedVariations.filter(v => v !== correctValue)
                distractor[feature] = randomElement(variationOptions)
            })
            answers.push(distractor)
        }

        return {
            puzzle,
            answers
        }
    }
}
