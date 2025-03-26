// Web Worker

import solveSat from 'boolean-sat';
import parseSexp from 's-expression';
import { solve as solveExactCover } from 'dlxlib';
import PolyominoProblem from './PolyominoProblem';
import { Polyomino } from './Polyomino';

self.z3Ready = false;
self.z3SolverOutputLines = [];
self.z3Solver = null;

self.onmessage = function(event) {

    if (event.data == 'loadZ3') {
        // Do nothing if it's already loaded
        if (self.z3Ready) return self.postMessage('z3Loaded');

        self.importScripts('z3w.js');

        self.z3Solver = Z3({
            ENVIRONMENT: 'WORKER',
            onRuntimeInitialized: () => {
                self.z3Ready = true;
                self.postMessage('z3Loaded');
            },
            print: message => self.z3SolverOutputLines.push(message),
        });
        return;
    }

    let { type, problem } = event.data;
    let polyProblem = new PolyominoProblem(
        problem.pieces.map(coords => new Polyomino(coords)),
        new Polyomino(problem.region),
        problem.allowRotation,
        problem.allowReflection
    );

    const totalPieceCoords = polyProblem.pieces.reduce((sum, p) => sum + p.coords.length, 0);
    const totalRegionCoords = polyProblem.region.coords.length;
    if (totalPieceCoords > totalRegionCoords) {
        // Trivially non-solvable
        return self.postMessage({ solution: null, time: 0 });
    }

    let startTime = performance.now();

    if (type == 'sat') {

        let { convertedProblem, interpreter } = polyProblem.convertToSAT();

        let { numVars, clauseList } = convertedProblem;
        let satSolution = solveSat(numVars, clauseList);
        let solution = satSolution == false ? null : [ polyProblem.region, ...interpreter(satSolution) ];

        self.postMessage({ 
            solution,
            time: performance.now() - startTime
        });

    } else if (type == 'z3') {

        if (!self.z3Ready) throw new Error('Z3 solver is still loading...');

        let { convertedProblem, interpreter } = polyProblem.convertToZ3();

        let { inputFile } = convertedProblem;

        self.z3Solver.FS.writeFile('input.smt2', inputFile, { encoding: 'utf-8' });
        self.z3Solver.callMain(['-smt2', 'input.smt2']);

        if (self.z3SolverOutputLines[0] == 'unsat') {
            self.postMessage({ solution: null, time: performance.now() - startTime });
        } else {
            let model = self.z3SolverOutputLines.slice(1).join(' ');
            let parsed = parseSexp(model);
            let solution = [ polyProblem.region, ...interpreter(parsed) ];

            self.postMessage({ solution, time: performance.now() - startTime });

            self.z3SolverOutputLines = [];
        }

    } else if (type == 'dlx') {

        let { convertedProblem, interpreter } = polyProblem.convertToDlx();

        let { matrix } = convertedProblem;

        let solutions = solveExactCover(matrix, null, null, 1);

        if (solutions.length == 0) {
            self.postMessage({ solution: null, time: performance.now() - startTime });
        } else {
            let rows = solutions[0].map(i => matrix[i]);
            let solution = [ polyProblem.region, ...interpreter(rows) ];
            self.postMessage({ solution, time: performance.now() - startTime });
        }

    }

};
