// generates matrix like [[123][231][312]] where no rows nor cols have same number
export const generate2dGrid = () => {
    const permutations = [
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
    ];

    const firstPick = permutations[Math.floor(Math.random() * permutations.length)];

    const rowsAvailableForSecondPick = permutations.filter(p => p[0] !== firstPick[0] && p[1] !== firstPick[1] && p[2] !== firstPick[2]);
    const secondPick = rowsAvailableForSecondPick[Math.floor(Math.random() * rowsAvailableForSecondPick.length)];

    const rowsAvailableForThirdPick = rowsAvailableForSecondPick.filter(p => p[0] !== secondPick[0] && p[1] !== secondPick[1] && p[2] !== secondPick[2]);
    const thirdPick = rowsAvailableForThirdPick[Math.floor(Math.random() * rowsAvailableForThirdPick.length)];

    return [
        firstPick,
        secondPick,
        thirdPick,
    ];
}