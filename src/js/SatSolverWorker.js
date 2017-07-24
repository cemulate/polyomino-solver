// Web Worker

import solveSat from 'boolean-sat';

self.onmessage = event => {

    let cnfProblem = event.data.cnfProblem;

    let solution = solveSat(cnfProblem.numVars, cnfProblem.clauseList);

    self.postMessage({solution});

};
