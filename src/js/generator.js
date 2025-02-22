import {randomElement, shuffle, threeRandomElements} from '@/js/helpers'

// returns {puzzle (3x3 array of cell objects), answers (array of cell objects)}
export const generateCellsAndAnswers = (grids, flavor, numAnswers) => {
    const featuresVariations = flavor.getFeaturesVariations()
    const featureNames = Object.keys(featuresVariations)
    if (grids.length !== featureNames.length) {
        throw new Error(`Expected ${featureNames.length} grids, got ${grids.length}`)
    }

    // Each grid only has values 0,1,2. Substitute them with the feature's descriptions.
    // chosenVariationsForFeature: { 'color' -> ["blue", "green", "red"] , 'shape' -> ['circle', ...] etc.}
    const chosenVariationsForFeature = {}
    for (const feature of featureNames) {
        chosenVariationsForFeature[feature] = threeRandomElements(featuresVariations[feature])
    }

    grids = shuffle(grids)

    // Build the puzzle as a 3x3 array of cell objects
    const cells = []
    for (let row = 0; row < 3; row++) {
        cells[row] = []
        for (let col = 0; col < 3; col++) {
            const cell = {}
            // For each feature, pick from chosenVariationsForFeature based on grids[featureIndex][row][col]
            featureNames.forEach((feature, featureIndex) => {
                const gridValue = grids[featureIndex][row][col] // 0,1,2
                cell[feature] = chosenVariationsForFeature[feature][gridValue]
            })
            cell.isAnswer = false
            cells[row][col] = cell
        }
    }

    let answerCell = cells[Math.floor(Math.random() * 3)][Math.floor(Math.random() * 3)]
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
        'cells': cells,
        'answers': answers
    }
}