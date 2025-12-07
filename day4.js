const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day4_input1.txt';

/** */
class GridPosition {
    constructor(row, col, value) {
        this.row = row;
        this.col = col;
        this.hasPaper = (value === '@');
        this.isMarkedForRemoval = false;
    }
    getRow = () => this.row;
    getCol = () => this.col;
    getHasPaperRoll = () => this.hasPaper
    removePaperRoll = () => { this.hasPaper = false; this.isMarkedForRemoval = false; }
    getMarkedForRemoval = () => this.isMarkedForRemoval;
    markForRemoval = () => this.isMarkedForRemoval = true;
}
/** */
class Grid {
    // array of strings
    constructor(inputValues) {
        this.positions = []; // [row][col] = boolean
        for (let i=0; i<inputValues.length; i++) {
            const positionsOnRow = [];
            for (let j=0; j<inputValues[i].length; j++) {
                positionsOnRow.push(new GridPosition(i, j, inputValues[i][j]));
            }
            this.positions.push(positionsOnRow);
        }
        this.numRows = this.positions.length;
        this.numCols = this.positions[0].length;
    }
    /** */
    getNumRows = () => this.numRows;
    getNumCols = () => this.numCols;
    getGridPosition = (row, col) => this.positions[row][col];

    __getAdjacentPositions = (gridPosition) => {
        const directions = [
            [-1, -1],   // NW
            [-1, 0],    // N
            [-1, 1],    // NE
            [0, -1],    // E
            [0, 1],     // W
            [1, -1],    // SW
            [1, 0],     // S
            [1, 1],     // SE
        ];
        const adjacentPositions = [];
        for (const [dRow, dCol] of directions) {
            const newRow = gridPosition.getRow() + dRow;
            const newCol = gridPosition.getCol() + dCol;
            if (newRow < 0 || newRow >= this.numRows || newCol < 0 || newCol >= this.numCols) continue;
            adjacentPositions.push(this.positions[newRow][newCol])
        }
        return adjacentPositions;
    }

    __markAccessibleForRemoval = (gridPosition) => {
        if (!gridPosition.getHasPaperRoll()) return false; // already missing or already removed

        const adjacentPositions = this.__getAdjacentPositions(gridPosition);
        // if there's fewer than 4 that have paper rolls, mark it as accessible
        const adjacentWithPaperCount = adjacentPositions.reduce((acc, pos) => pos.getHasPaperRoll() ? acc + 1 : acc, 0);
        if (adjacentWithPaperCount < 4) {
            gridPosition.markForRemoval(); // mark for removal (to avoid affecting other checks in this pass)
            return true;
        }
        return false;
    }

    /** */
    removeAccessiblePaperRolls = () => {
        let removedPaperRolls = 0;
        // first mark all accessible for removal (don't remove yet to avoid affecting what's accessible)
        for (let row=0; row<this.numRows; row++) {
            for (let col=0; col<this.numCols; col++) {
                const gridPosition = this.getGridPosition(row, col);
                if (this.__markAccessibleForRemoval(gridPosition))
                    removedPaperRolls++;
           }
        }
        // then actually remove
        for (let row=0; row<this.numRows; row++) {
            for (let col=0; col<this.numCols; col++) {
                const gridPosition = this.getGridPosition(row, col);
                if (gridPosition.getMarkedForRemoval())
                    gridPosition.removePaperRoll();
            }
        }
        return removedPaperRolls;
    }
}

/** */
const readPaperRollGridInput = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    return inputData.split('\n');
}

/** */
(async () => {
    const gridInput = await readPaperRollGridInput();
    const grid = new Grid(gridInput);

    let totalPaperRollsRemoved = 0;
    let incrementalPaperRollsRemoved = grid.removeAccessiblePaperRolls();
    while (incrementalPaperRollsRemoved > 0) {
        totalPaperRollsRemoved += incrementalPaperRollsRemoved;
        incrementalPaperRollsRemoved = grid.removeAccessiblePaperRolls();
    }
    console.log("Total removed paper rolls:", totalPaperRollsRemoved);

    // let output = "";
    // for (let row=0; row<grid.getNumRows(); row++) {
    //     for (let col=0; col<grid.getNumCols(); col++) {
    //         const gridPosition = grid.getGridPosition(row, col);
    //         output += gridPosition.getHasPaperRoll() ? '@' : '.';
    //     }
    //     output += "\n";
    // }
    // console.log(output);
})();
