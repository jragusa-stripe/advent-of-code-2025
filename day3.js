const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day3_input1.txt';
const JOLTAGE_LENGTH = 12;


/** */
const readBatteryBanks = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    return inputData.split('\n');
}
/**
 * digitNumber: 1=first, 2=second, ... 12=twelfth
 * startIndex: index to start search from (prev digit index+1)
 */
const findMaxDigit = (bank, digitNumber, startIndex) => {
    let maxDigit = 0;
    let maxDigitIndex = -1;
    // skip last digits to assure enough digits remain
    const skipCount = JOLTAGE_LENGTH - digitNumber;
    for (let i=startIndex; i<bank.length-skipCount; i++) {
        const digit = +(bank[i]);
        if (digit > maxDigit) {
            maxDigit = digit;
            maxDigitIndex = i;
        }
    }
    return maxDigitIndex;
}

/** main */
(async () => {
    const banks = await readBatteryBanks();
    const joltages = [];

    for (const bank of banks) {
        let joltage = '';
        let currentIndex = 0;
        for (let digitNumber=1; digitNumber<=JOLTAGE_LENGTH; digitNumber++) {
            currentIndex = findMaxDigit(bank, digitNumber, currentIndex);
            joltage += `${bank[currentIndex]}`;
            currentIndex++;
        }
        joltages.push(+joltage);
    }
    console.log("Joltages", joltages);
    console.log("Total joltage:", joltages.reduce((acc, val) => acc + val, 0));
})();
