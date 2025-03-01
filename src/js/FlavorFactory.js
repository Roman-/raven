import {multiShapeFlavor} from "@/js/puzzle_flavors/multiShapeFlavor";
import {emojiFlavor} from "@/js/puzzle_flavors/emojiFlavor";
import {squareGradientsFlavor} from "@/js/puzzle_flavors/squareGradientsFlavor";
import {shapeFlavor} from "@/js/puzzle_flavors/shapeFlavor";
import {colorWheelFlavor} from "@/js/puzzle_flavors/colorWheelFlavor";

const flavors = [
        multiShapeFlavor,
        emojiFlavor,
        squareGradientsFlavor,
        shapeFlavor,
        // colorWheelFlavor,
]

export const getRandomFlavor = (numFeatures) => {
        const availableFlavors = flavors.filter(f => Object.keys(f.getFeaturesVariations()).length >= numFeatures);
        if (availableFlavors.length === 0) {
            let description = flavors.map(f => f.name + " (" + Object.keys(f.getFeaturesVariations()).length + ")").join(", ");
            throw new Error(`No flavors available for ${numFeatures} features. All flavors:` + description);
        }
        const randomIndex = Math.floor(Math.random() * availableFlavors.length);
        return availableFlavors[randomIndex];
};
