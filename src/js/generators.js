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
export const generateSetOfGrids = (numFeatures) => {
    switch (numFeatures) {
        case 1:
            return [generatePermutedGrid()];
        case 2:
            return [generatePermutedGrid(), generateAlignedGrid()];
        case 3:
            return [generatePermutedGrid(), generateAlignedGrid(0), generateAlignedGrid(1)];
        case 4:
            return [generatePermutedGrid(), generateAlignedGrid(0), generateAlignedGrid(1), generateConstantGrid()];
        case 5:
            return [generatePermutedGrid(0), generatePermutedGrid(1), generateAlignedGrid(0), generateAlignedGrid(1), generateConstantGrid()];
        default:
            console.error("Unsupported number of features", numFeatures);
    }
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

