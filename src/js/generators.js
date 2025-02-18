// generates matrix like [[123][231][312]] where no rows nor cols have same number
import {randomElement, shuffle} from "@/js/helpers";
import {bgColors, emojiCategories} from "@/js/property_sets";

export const generateAlignedGrid = () => {
    return Math.random() > 0.5 ? [[0, 0, 0], [1, 1, 1], [2, 2, 2]] : [[0, 1, 2], [0, 2, 1], [0, 1, 2]]
}
export const generatePermutedGrid = () => {
    const permutations = [
        [1, 2, 0],
        [1, 0, 2],
        [2, 1, 0],
        [2, 0, 1],
        [0, 1, 2],
        [0, 2, 1],
    ];

    const firstPick = randomElement(permutations)

    const rowsAvailableForSecondPick = permutations.filter(p => p[0] !== firstPick[0] && p[1] !== firstPick[1] && p[2] !== firstPick[2]);
    const secondPick = randomElement(rowsAvailableForSecondPick)

    const rowsAvailableForThirdPick = rowsAvailableForSecondPick.filter(p => p[0] !== secondPick[0] && p[1] !== secondPick[1] && p[2] !== secondPick[2]);
    const thirdPick = randomElement(rowsAvailableForThirdPick)

    return [
        firstPick,
        secondPick,
        thirdPick,
    ];
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

