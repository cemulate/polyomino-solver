import { Polyomino } from './Polyomino.js';

import CNFBuilder from './CNFBuilder.js';

export default class PolyominoProblem {

    constructor(pieces, region, allowRotation=true, allowReflection=false) {
        this.pieces = pieces.map(x => x.normalize());
        this.region = region.normalize();
        this.allowRotation = allowRotation;
        this.allowReflection = allowReflection;

        // Extremal bounds
        this.width = this.region.getWidth();
        this.height = this.region.getHeight();
    }

    _fits(piece) {
        if (piece.getLargestX() < this.width && piece.getLargestY() < this.height) {
            // It's possible
            // Check that every coordinate is actually in the region
            return piece.coords.every(c => this.region.containsCoordinate(c));
        } else {
            return false;
        }
    }

    * _generateAllPossibleConfigurations(piece) {

        for (let rotation of [ 0, ...(this.allowRotation ? [1, 2, 3] : []) ]) {
            for (let reflected of [ false, ...(this.allowReflection ? [ true ] : []) ]) {
                for (let dx = 0; dx < this.width; dx ++) {
                    for (let dy = 0; dy < this.height; dy ++) {

                        let config = piece.rotate(rotation);
                        if (reflected) config = config.reflect();
                        config = config.normalize();
                        config = config.translate(dx, dy);

                        if (this._fits(config)) yield config;
                    }
                }
            }
        }

    }

    convertToSAT() {

        // Here we go.

        // First, generate all the possible ways each piece can be:

        let pieceData = [];
        let curVariableOffset = 1;
        for (let piece of this.pieces) {
            let pset = Array.from(this._generateAllPossibleConfigurations(piece));
            let offset = curVariableOffset;

            let data = {
                varsOffset: offset,
                varsLength: pset.length,
                varsEnd: offset + pset.length,
                getCorrespondingPolyConfiguration: varIndex => {
                    // This closes over the variables pset and offset, to provide a way to get the particular Polyomino associated with a variable
                    if ((varIndex - offset) >= 0 && (varIndex - offset) < pset.length) return pset[varIndex - offset];
                    return null;
                }
            };

            curVariableOffset += pset.length;
            pieceData.push(data);
        }

        let cnf = new CNFBuilder();

        // Encode the fact that one piece can't exist in multiples orientations/places

        for (let data of pieceData) {

            for (let v = data.varsOffset; v < data.varsEnd; v ++) {
                for (let w = v+1; w < data.varsEnd; w ++) {

                    // For all possible (v, w) of variables representing the configuration of one piece,
                    // at least one of v or w must be false (otherwise, the piece would exist in two ways/places)

                    cnf.beginClause();
                    cnf.addNot(v);
                    cnf.addNot(w);
                    cnf.endClause();
                }
            }

        }

        // However, each piece must exist in at least one configuration

        for (let data of pieceData) {

            // One clause that OR's all of the configurations

            cnf.beginClause();
            for (let v = data.varsOffset; v < data.varsEnd; v ++) {
                cnf.add(v);
            }
            cnf.endClause();

        }

        for (let i = 0; i < pieceData.length; i ++) {
            for (let j = i+1; j < pieceData.length; j ++) {

                // Do it that way to be non-redunant with the combinations

                let data = pieceData[i];
                let otherData = pieceData[j];

                for (let v = data.varsOffset; v < data.varsEnd; v ++) {
                    for (let w = otherData.varsOffset; w < otherData.varsEnd; w ++) {

                        let configOfPiece = data.getCorrespondingPolyConfiguration(v);
                        let configOfOtherPiece = otherData.getCorrespondingPolyConfiguration(w);

                        if (!configOfPiece.isDisjointFrom(configOfOtherPiece)) {

                            // These configurations are incompatible, so at least one of them must be false

                            cnf.beginClause();
                            cnf.addNot(v);
                            cnf.addNot(w);
                            cnf.endClause();
                        }

                    }
                }

            }
        }

        // Oh boy.

        // This function provides an interpretation of a solution to the CNF problem for this Polyomino Problem.
        // That is, it provides a recipe to convert the solution of this CNF problem to a solution of this particular Polyomino problem.

        let interpreter = solution => solution.map((v, i) => {
            if (i == 0 || !v) return null;
            let data = pieceData.find(data => data.getCorrespondingPolyConfiguration(i) != null);
            return data.getCorrespondingPolyConfiguration(i);
        }).filter(x => x != null);

        // The caller is responsible for solving the cnf problem, and running `interpreter` on the solution

        return { convertedProblem: cnf.getCNFProblem(), interpreter };

    }

    convertToZ3() {
        let program = [];
        let exp = (...parts) => `( ${parts.join(' ')} )`;
        let assert = e => exp('assert', e);
        let varName = (i, j) => `p_${i}_${j}`;

        let pieceData = this.pieces.map(piece => Array.from(this._generateAllPossibleConfigurations(piece)));

        pieceData.forEach((configs, pieceIndex) => {
            configs.forEach((configuration, configIndex) => {
                program.push(exp('declare-const', varName(pieceIndex, configIndex), 'Bool'));
            });
        });

        // Any given piece cannot exist in multiple configurations, but must exist in at least one configuration
        pieceData.forEach((configs, pieceIndex) => {
            // No more than one configuration
            program.push(assert(exp(
                exp('_', 'at-most', '1'),
                ...configs.map((configuration, configIndex) => varName(pieceIndex, configIndex)),
            )));

            // At least one configuration
            program.push(assert(exp(
                'or',
                ...configs.map((configuration, configIndex) => varName(pieceIndex, configIndex)),
            )));
        });

        // Pieces cannot overlap each other
        pieceData.forEach((configs, pieceIndex) => {
            configs.forEach((configuration, configIndex) => {

                // Gather variables corresponding to configurations of OTHER pieces
                // that THIS configuration of THIS piece would overlap with
                let disallowedVariables = [];
                pieceData.forEach((otherConfigs, otherPieceIndex) => {
                    otherConfigs.forEach((otherConfiguration, otherConfigIndex) => {
                        if (pieceIndex == otherPieceIndex) return;

                        if (!configuration.isDisjointFrom(otherConfiguration)) {
                            disallowedVariables.push(varName(otherPieceIndex, otherConfigIndex));
                        }
                    });
                });

                if (disallowedVariables.length > 0) {
                    // This configuration implies not any of the disallowed configurations
                    program.push(assert(exp(
                        '=>',
                        varName(pieceIndex, configIndex),
                        exp('not', exp('or', ...disallowedVariables)),
                    )));
                }
            });
        });

        program.push(exp('check-sat'));
        program.push(exp('get-model'));
        program.push(exp('exit'));

        let interpreter = solution => {
            let polys = [];

            for (let assignment of solution.slice(1)) {
                let variable = assignment[1];
                let value = (assignment[4] == 'true');

                if (value) {
                    let [_, pieceIndex, configIndex] = variable.split('_');
                    polys.push(pieceData[pieceIndex][configIndex]);
                }
            }

            return polys;
        }

        return { convertedProblem: { inputFile: program.join('\n') }, interpreter };
    }

    convertToDlx() {
        let matrix = [];

        let rowSize = this.pieces.length + this.region.coords.length;

        this.pieces.forEach((piece, pieceIndex) => {
            let configs = Array.from(this._generateAllPossibleConfigurations(piece));
            for (let config of configs) {
                let row = new Array(rowSize).fill(0);

                row[pieceIndex] = 1;

                for (let c of config.coords) {
                    let index = this.region.coords.findIndex(x => c[0] == x[0] && c[1] == x[1]);
                    row[this.pieces.length + index] = 1;
                }

                matrix.push(row);
            }
        });

        let findOneIndices = arr => {
            let next = arr.indexOf(1);
            if (next < 0) return [];
            return [ next, ...findOneIndices(arr.slice(next + 1)).map(i => next + 1 + i) ];
        }

        let interpreter = solution => {
            return solution.map(row => {
                let ones = findOneIndices(row.slice(this.pieces.length));
                return new Polyomino(ones.map(i => this.region.coords[i]));
            });
        }

        return { convertedProblem: { matrix }, interpreter };
    }

}
