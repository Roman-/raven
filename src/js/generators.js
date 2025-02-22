// generates matrix like [[123][231][312]] where no rows nor cols have same number
import {randomElement, shuffle} from "@/js/helpers";
import {bgColors, emojiCategories} from "@/js/property_sets";

export const generateAlignedGrid = (isRowwise = -1) => {
    if (isRowwise === -1) {
        isRowwise = Math.random() > 0.5;
    }
    return isRowwise ? [[0, 0, 0], [1, 1, 1], [2, 2, 2]] : [[0, 1, 2], [0, 1, 2], [0, 1, 2]]
}
export const generatePermutedGrid = (isFirstVariation = -1) => {
    if (isFirstVariation === -1) {
        isFirstVariation = Math.random() > 0.5;
    }
    return isFirstVariation ? [[0, 1, 2], [2, 0, 1], [1, 2, 0]] : [[0, 1, 2], [1, 2, 0], [2, 0, 1]]
}
export const generateConstantGrid = () => {
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
}
export const generateSetOfGridsMaximumDifficulty = (numFeatures) => {
    switch (numFeatures) {
        case 1:
            return [generatePermutedGrid()];
        case 2:
            return [generatePermutedGrid(), generateAlignedGrid()];
        case 3:
            return Math.random() > 0.5
                ? [generatePermutedGrid(),  generateAlignedGrid(0),  generateAlignedGrid(1)]
                : [generatePermutedGrid(0), generatePermutedGrid(1), generateAlignedGrid()]
        case 4: {
            if (Math.random() > 0.8) {
                return [generatePermutedGrid(0), generatePermutedGrid(0), generatePermutedGrid(1), generateAlignedGrid()]
            }
            if (Math.random() > 0.7) {
                return [generatePermutedGrid(0), generatePermutedGrid(1), generatePermutedGrid(1), generateAlignedGrid()]
            }
            return [generatePermutedGrid(0), generatePermutedGrid(1), generateAlignedGrid(0), generateAlignedGrid(1)]
        }
        default:
            console.error("generateSetOfGridsMaximumDifficulty: Unsupported number of features", numFeatures);
    }
}

export const generateSetOfGrids = (numFeatures, numNonConstantFeatures) => {
    const grids = generateSetOfGridsMaximumDifficulty(numNonConstantFeatures);
    for (let i = 0; i < numFeatures - numNonConstantFeatures; i++) {
        grids.push(generateConstantGrid());
    }
    return grids;
}

const randomThreeElements = (array) => {
    const copy = [...array];
    shuffle(copy);
    return copy.slice(0, 3);
}

const sameThreeElements = (array) => {
    const picked = randomElement(array)
    return [picked, picked, picked];
}

export const threeElements = (array, isDifferent) => {
    return isDifferent ? randomThreeElements(array) : sameThreeElements(array);
}

export const generateThreeColors = (different) => {
    return threeElements(bgColors, different);
}

export const generateThreeEmojis = (different) => {
    const category = randomElement(emojiCategories)
    return threeElements(category, different);
}

