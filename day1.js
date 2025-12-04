const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day1_input1.txt';

class Dial {
    constructor(initialPosition) {
        this.currentPosition = initialPosition;
        this.zeroesCount = 0;
        this.numPassedZero = 0;
    }

    static getDirection = (combo) => combo[0];
    static getClicks = (combo) => parseInt(combo.slice(1), 10);

    moveRightOne = () => {
        // advance position
        this.currentPosition = (this.currentPosition === 99) ? 0 : this.currentPosition + 1;
        // check if passing zero
        if (this.currentPosition === 0) { this.numPassedZero++; }
    }
    moveRight = (clicks) => {
        for (let i = 0; i < clicks; i++) {
            this.moveRightOne();
        }
        if (this.currentPosition === 0) { this.zeroesCount++; }
    }
    moveLeftOne = () => {
        // advance position
        this.currentPosition = (this.currentPosition === 0) ? 99 : this.currentPosition - 1
        // check if passing zero
        if (this.currentPosition === 0) { this.numPassedZero++; }
    }
    moveLeft = (clicks) => {
        for (let i = 0; i < clicks; i++) {
            this.moveLeftOne();
        }
        if (this.currentPosition === 0) { this.zeroesCount++; }
    }
    getPosition = () => this.currentPosition;
    getZeroesCount = () => this.zeroesCount;
    getNumPassedZero = () => this.numPassedZero;
}

const readCombinations = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    return inputData.split('\n');
}

/** main */
(async () => {
    const combos = await readCombinations();

    const dial = new Dial(50);

    for (const combo of combos) {
        const direction = Dial.getDirection(combo);
        const clicks = Dial.getClicks(combo)
        switch (direction) {
            case 'L':
                dial.moveLeft(clicks); break;
            case 'R':
                dial.moveRight(clicks); break;
            default:
                throw new Error(`Invalid direction: ${direction}`);
        }
    }
    console.log("end position", dial.getPosition(), "num land zero", dial.getZeroesCount(), "num passed zero", dial.getNumPassedZero());
})();
