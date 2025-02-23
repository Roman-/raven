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
    const answers = generateAnswers(numAnswers, answerCell, chosenVariationsForFeature)

    return {
        'cells': cells,
        'answers': answers
    }
}

// chosenVariationsForFeature: { 'color' -> ["blue", "green", "red"] , 'shape' -> ['circle', ...] etc.}
const generateAnswers = (maxAnswers, answerCell, chosenVariationsForFeature) => {
    let answers = [answerCell]
    const prototypeAnswer = () => ({ ...answerCell, isAnswer: false });

    const featureNames = shuffle(Object.keys(chosenVariationsForFeature))
    let alteredPairs = [] // [[feature1, alteredValue1], [feature2, alteredValue2], ...]

    featureNames.forEach(feature => {
        const allFeatureValues = chosenVariationsForFeature[feature]
        const correctFeatureValue = answerCell[feature]
        const wrongFeatureValues = shuffle(allFeatureValues.filter(v => v !== correctFeatureValue))
        wrongFeatureValues.forEach(wrongFeatureValue => {
            alteredPairs.push([feature, wrongFeatureValue])
        })
    })
    // use answerCell as the prototype to generate answers
    alteredPairs.forEach(pair => {
        const feature = pair[0]
        const wrongFeatureValue = pair[1]
        const newAnswerCell = prototypeAnswer()
        newAnswerCell[feature] = wrongFeatureValue
        answers.push(newAnswerCell)
    })

    if (answers.length >= maxAnswers || featureNames.length === 1) {
        return shuffle(answers.splice(0, maxAnswers))
    }

    // add variations that will differ by two features, since featureNames.length > 1
    const feature0 = featureNames[0]
    const feature1 = featureNames[1]
    chosenVariationsForFeature[feature0].filter(v => v !== answerCell[feature0]).forEach(wrongValueOfFeature0 => {
        chosenVariationsForFeature[feature1].filter(v => v !== answerCell[feature1]).forEach(wrongValueOfFeature1 => {
            const newAnswerCell = prototypeAnswer()
            newAnswerCell[feature0] = wrongValueOfFeature0
            newAnswerCell[feature1] = wrongValueOfFeature1
            answers.push(newAnswerCell)
        })
    })
    if (answers.length >= maxAnswers || featureNames.length === 2) {
        return shuffle(answers.splice(0, maxAnswers))
    }

    console.error("Out of answer variations: generated " + answers.length + " answers, but max is " + maxAnswers)

    return shuffle(answers)
}