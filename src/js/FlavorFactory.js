import {multiShapeFlavor} from "@/js/puzzle_flavors/multiShapeFlavor";
import {emojiFlavor} from "@/js/puzzle_flavors/emojiFlavor";
import {squareGradientsFlavor} from "@/js/puzzle_flavors/squareGradientsFlavor";
import {shapeFlavor} from "@/js/puzzle_flavors/shapeFlavor";
import {colorWheelFlavor} from "@/js/puzzle_flavors/colorWheelFlavor";
import {columnsOfCirclesFlavor} from "@/js/puzzle_flavors/columnsOfCirclesFlavor";
import {tiledLinesFlavor} from "@/js/puzzle_flavors/tiledLinesFlavor";
import {shapeUnionFlavor} from "@/js/puzzle_flavors/ShapeUnionFlavor";

export const allFlavors = [
        multiShapeFlavor,
        emojiFlavor,
        squareGradientsFlavor,
        shapeFlavor,
        columnsOfCirclesFlavor,
        colorWheelFlavor,
    tiledLinesFlavor,
    // shapeUnionFlavor
]

export const getRandomFlavor = (flavors, numFeatures) => {
        const availableFlavors = flavors.filter(f => Object.keys(f.getFeaturesVariations()).length >= numFeatures);
        if (availableFlavors.length === 0) {
            let description = flavors.map(f => f.name + " (" + Object.keys(f.getFeaturesVariations()).length + ")").join(", ");
            return null;
        }
        const randomIndex = Math.floor(Math.random() * availableFlavors.length);
        return availableFlavors[randomIndex];
};
