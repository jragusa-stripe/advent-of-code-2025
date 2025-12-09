const fsPromises = require('node:fs/promises');

const INPUT_FILE = './day6_input1.txt';

/** */
const readProblems = async () => {
    const inputData = await fsPromises.readFile(INPUT_FILE, 'utf8');
    const inputLines = inputData.split('\n');
    const transposedProblems = [];
    for (const inputLine of inputLines) {
        const problemArguments = [];
        for (const inputValue of inputLine.split(" ")) {
            if (inputValue.trim() === "") continue;
            problemArguments.push(inputValue);
        }
        transposedProblems.push(problemArguments);
    }
    // now transpose to problem grouping
    let problems;
    for (let i=0; i<transposedProblems.length; i++) {
        if (problems === undefined) {
            problems = new Array(transposedProblems[i].length);
        }
        for (let j=0; j<transposedProblems[i].length; j++) {
            if (problems[j] === undefined) {
                problems[j] = new Array(transposedProblems.length);
            }
            problems[j][i] = transposedProblems[i][j];
        }
    }
    return problems;
}


(async () => {
    const problems = await readProblems();
    let totalResult = 0;
    for (const problem of problems) {
        //console.log(problem);
        const operator = problem[problem.length-1];
        const operands = problem.slice(0,problem.length-1).map(Number);

        // convert to array of operand lengths, then sort (both directions) and compare
        let operandLengths = operands.map(operand => (""+operand).length);
        const sortup_operands = [...operandLengths];
        sortup_operands.sort((a,b) => a - b)
        const sortdown_operands = [...operandLengths];
        sortdown_operands.sort((a,b) => b - a);
        if (operandLengths.join() !== sortup_operands.join() && operandLengths.join() !== sortdown_operands.join()) {
            throw "problem "+operandLengths.join();
        }

        switch (operator) {
            case '+': {
                const result = operands.reduce((acc, val) => acc + val, 0);
                //console.log("result", result);
                totalResult += result;
                break;
            }
            case '*': {
                const result = operands.reduce((acc, val) => acc * val, 1);
                //console.log("result", result);
                totalResult += result;
                break;
            }
            default: throw "Unrecognized operator "+operator;
        }
    }
    console.log("total result", totalResult);

})();

/*
2175
64
23
314
+
---
54 + 431 + 623

2
35
+
--
5 + 23


*/