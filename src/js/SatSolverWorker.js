// Web Worker

import solveSat from 'boolean-sat';
import parseSexp from 's-expression';

self.onmessage = function(event) {

    let { type, problem } = event.data;

    if (type == 'sat') {

        let { numVars, clauseList } = problem;
        let solution = solveSat(numVars, clauseList);

        self.postMessage({ solution });

    } else if (type == 'z3') {

        if (!self.ready) throw new Error('Z3 solver is still loading...');

        let { inputFile } = problem;

        self.solver.FS.writeFile('input.smt2', inputFile, { encoding: 'utf-8' });
        self.solver.callMain(['-smt2', 'input.smt2']);

        if (self.solverOutputLines[0] == 'unsat') {
            self.postMessage({ solution: null });
        } else {
            let model = self.solverOutputLines.slice(1).join(' ');
            let parsed = parseSexp(model);

            self.postMessage({ solution: parsed });

            self.solverOutputLines = [];
        }

    }

};

self.ready = false;

self.importScripts('z3w.js');

self.solverOutputLines = [];
self.solver = Z3({
    ENVIRONMENT: 'WORKER',
    onRuntimeInitialized: () => {
        self.ready = true;
        self.postMessage('ready')
    },
    print: message => solverOutputLines.push(message),
});
