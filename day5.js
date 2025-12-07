const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day5_input1.txt';

/** */
const readIngredients = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    const inputArray = inputData.split('\n');
    const blankIndex = inputArray.findIndex(inputLine => inputLine.trim() === '');
    return [inputArray.slice(0, blankIndex), inputArray.slice(blankIndex + 1)];
}

const printPointMap = (pointMap) => {
    for (const [key,value] of pointMap.entries()) {
        console.log(key, value);
    }
}
/** */
(async () => {
    const [freshRanges, availIngredients] = await readIngredients();
    
    //////////////////////////////////////////////////////////////////////////////////
    // part 1

    let freshAvailableCount = 0;
    // for each avail ingredient
    for (const ingredient of availIngredients.map(Number)) {
        // check if ingredient is in any fresh range
        for (const freshRange of freshRanges) {
            const [start, end] = freshRange.split('-').map(Number);
            // if ingredient is in range, mark as fresh available ingredient
            if (ingredient >= start && ingredient <= end) {
                freshAvailableCount++;
                break; // no need to check other ranges
            }
        }
        // mark as not fresh available
    }
    // report total fresh available ingredients
    console.log("Total fresh available ingredients:", freshAvailableCount);

    //////////////////////////////////////////////////////////////////////////////////
    // part 2 // can't use straightforward set deduplication due to size limitations on Set

    // walk through pairs and create ordered array of points (start points & end points) (single list)
    const _singleMemberRanges = new Set();
    const _points = new Set(); // start points & end points of ranges
    for (const freshRange of freshRanges) {
        const [start, end] = freshRange.split('-').map(Number);
        if (start === end) {
            _singleMemberRanges.add(start); // treat these separately
            continue;
        }
        _points.add(start);
        _points.add(end);
    }
    // narrow singleMember group to those that aren't counted elsewhere
    const singleMemberRanges = [..._singleMemberRanges].filter((value) => { return !_points.has(value); });

    const points = [..._points];
    points.sort((a,b) => a-b);

    // create map of point to boolean (on or off), default all to off
    const pointMap = new Map();
    for (const point of points) {
        pointMap.set(point, false); // [ points[pointIndex], points[pointIndex +1] ] is "off" (default)
    }
    pointMap.set(points[points.length-1], undefined);  // last value is meaningless

    //printPointMap(pointMap);
    
    // walk through pairs and flip "on" each point between start & end (may already be on from overlapping pair)
    for (const freshRange of freshRanges) {
        const [start, end] = freshRange.split('-').map(Number);
        if (start === end) continue; // again skip these
        // find start point
        let index = points.findIndex((value) => value === start);
        // interate to end point
        while (points[index] !== end) {
            pointMap.set(points[index], true);
            index++;
        }
    }

    //printPointMap(pointMap);

    // walk through points and add up gap between points for "on" points
    let totalFreshIngredientCount = 0;
    for (let index=0; index<points.length; index++) {
        if (pointMap.get(points[index]) === true) {
            totalFreshIngredientCount += (points[index+1] - points[index])   // last point will be undefined, so accessing index+1 is ok
            if (pointMap.get(points[index+1]) === undefined || pointMap.get(points[index+1]) === false) {
                totalFreshIngredientCount++; // make inclusive
            }
        }
    }
    totalFreshIngredientCount += singleMemberRanges.length; // separately add back in these guys
    
    // report total fresh ingredients
    console.log("Total fresh ingredients:", totalFreshIngredientCount);
})();
