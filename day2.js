const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day2_input1.txt';

const TYPE = {
    ONCE: "once",
    AT_LEAST_ONCE: "atleast"
};
//const problemType = TYPE.ONCE;
const problemType = TYPE.AT_LEAST_ONCE

/** */
const readProductIdRanges = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    return inputData.split(',');
}

/** repeated once */
const isValidProductId = (id) => {
    // convert each number to a string
    const _id = id.toString();
    // check if even length
    if (_id.length % 2 !== 0) return true;

    // check (0,mid) == (mid,len)
    const mid = _id.length / 2;
    const left = _id.slice(0, mid);
    const right = _id.slice(mid);
    if (left !== right) return true;

    return false;
}

/** */
const isRepeated = (s1, s) => {
    for (let i=s1.length; i<s.length; i+=s1.length) {
        if (s1 !== s.slice(i, i+s1.length)) return false;
    }
    return true;
}
/** repeated at least once */
const isValidProductId2 = (id) => {
    // convert each number to a string
    const _id = id.toString();
    // go through each substring s1 from 0,1 to 0,mid
    const mid = Math.floor(_id.length / 2);

    for (let len=1; len<=mid; len++) {
        const s1 = _id.slice(0, len);
        // if string length isn’t divisible by s1 length continue
        if (_id.length % s1.length !== 0) continue;
        // if isRepeated return false
        if (isRepeated(s1, _id)) return false;
    }
    return true;
}

/** main */
(async () => {
    // parse input into array of ranges
    const ranges = await readProductIdRanges();

    const invalidIDs = [];
    for (const range of ranges) {

        // for each range, loop through from start to finish
        const [first, last] = range.split('-');
        for (let id = +first; id <= +last; id++) {
            // track invalid product IDs
            if (problemType === TYPE.ONCE) {
                if (!isValidProductId(id))
                    invalidIDs.push(id);
            } else if (problemType === TYPE.AT_LEAST_ONCE) {
                if (!isValidProductId2(id))
                    invalidIDs.push(id);
            }
        }
    }
    console.log("Invalid IDs", invalidIDs);
    // sum up invalid ID array
    console.log("Sum:", invalidIDs.reduce((a,b) => a + b, 0));
})();
