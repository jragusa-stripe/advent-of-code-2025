const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day8_input1.txt';
const PAIRS_TO_CONNECT = 1000; // 10

const readJunctions = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    const inputLines = inputData.split('\n');
    return inputLines.map(inputLine => new Junction(inputLine));
}

class Junction {
    constructor(tupleString) {
        const coordinates = tupleString.split(",");
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    }
    getX = () => this.x;
    getY = () => this.y;
    getZ = () => this.z;
    getId = () => `${this.x}:${this.y}:${this.z}`;
    hash = () => this.getId();

    static distanceBetween = (j1, j2) => {
        const xDiff = j2.getX() - j1.getX();
        const yDiff = j2.getY() - j1.getY();
        const zDiff = j2.getZ() - j1.getZ();
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
    }
    static extractIds = (pairKey) => {
        const [j1, j2] = pairKey.split("::");
        return [j1, j2];
    }
}
class Circuit {
    constructor() {
        this.junctions = new Set();
    }
    initWithJunction = (junction) => {
        this.junctions.add(junction.getId());
        return this;
    }
    initWithCircuits = (circuit1, circuit2) => {
        for (const junctionId of circuit1.getJunctions()) {
            this.junctions.add(junctionId);
        }
        for (const junctionId of circuit2.getJunctions()) {
            this.junctions.add(junctionId);
        }
        return this;
    }
    getJunctions = () => this.junctions;
    size = () => this.junctions.size;
    toString = () => [...this.junctions];
    getId = () => [...this.junctions].sort(); // stable, regardless of junction add order
}

/**  */
const joinShortestDistanceJunctionsIntoCircuit = (distances, reverseDistanceMap, circuits) => {

    const shortestJunctionPair = reverseDistanceMap.get(distances[0]);
    const [j1Id, j2Id] = Junction.extractIds(shortestJunctionPair[0]); // TODO: deal with fact that there could be multiple junction pairs per distance
    // find circuits from junction pair
    const circuitsToMerge = [];
    for (const circuit of circuits) {
        if (circuit.getJunctions().has(j1Id) || circuit.getJunctions().has(j2Id)) {
            circuitsToMerge.push(circuit);
        }
    }
    if (circuitsToMerge.length === 1) return; // no point in deleting it and readding it

    // remove circuits from circuit set
    for (const circuit of circuitsToMerge) {
        circuits.delete(circuit);
    }
    // add new circuit to circuit set
    circuits.add(new Circuit().initWithCircuits(circuitsToMerge[0], circuitsToMerge[1]));
}

/**  */
(async () => {
    const junctions = await readJunctions();

    // build map of distances between each junction
    const distanceMap = new Map();
    for (const j1 of junctions) {
        for (const j2 of junctions) {
            if (j1.getId() === j2.getId()) break; // skip same junction, skip the duplicate half of pairs (reverse direction)
            distanceMap.set(`${j1.getId()}::${j2.getId()}`, Junction.distanceBetween(j1, j2));
        }
    }

    // build reverse map (distance -> list of junction pairs)
    const reverseDistanceMap = new Map();
    for (const [key, distance] of distanceMap) {
        let junctionPairList = reverseDistanceMap.get(distance);
        if (!junctionPairList) { junctionPairList = []; }
        junctionPairList.push(key);
        reverseDistanceMap.set(distance, junctionPairList);
    }
    const distances = [...reverseDistanceMap.keys()];
    distances.sort((a,b) => a - b);

    // initialize circuits to be a separate circuit for each junction
    const circuits = new Set();
    for (const junction of junctions) {
        circuits.add(new Circuit().initWithJunction(junction));
    }

    // link up the x shortest path junctions into circuits
    for (let i = 0; i<PAIRS_TO_CONNECT; i++) {
        joinShortestDistanceJunctionsIntoCircuit(distances.slice(i), reverseDistanceMap, circuits);
    }

    /*
    let count = 0;
    for (const [key, distance] of distanceMap) {
        console.log(key, distance);
        count++;
    }
    console.log("count", count);
    *//*
    let count2 = 0;
    for (const [distance, listOfPairs] of reverseDistanceMap) {
        console.log(distance, listOfPairs);
        count2++;
    }
    console.log("count2", count2);
    //*/
    /*
    distances.forEach(distance => {
        console.log(distance, " => ", reverseDistanceMap.get(distance));
    });
    //*/
    //*
    for (const circuit of circuits) {
        console.log(circuit.toString()); //console.log(circuit.getId());
    }
    //*/
   const circuitSizes = [...circuits].map(circuit => circuit.size()).sort((a,b) => b - a).slice(0,3);
   console.log("Circuit size multiple:", circuitSizes.reduce((acc, element) => acc * element, 1));
})();
