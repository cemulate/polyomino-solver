import Polyomino from './Polyomino.js';

import CNFBuilder from './CNFBuilder.js';

export default class PolyominoProblem {

    constructor(pieces, region, allowRotation=true, allowReflection=false) {
        this.pieces = pieces.map(x => x.getMinimalNonNegative());
        this.region = region.getMinimalNonNegative();
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

    * _generateAllPossibleForPiece(piece) {

        let orientations = [ piece.rotate(0).getMinimalNonNegative() ];
        if (this.allowRotation) orientations.push(...[1,2,3].map(i => piece.rotate(i).getMinimalNonNegative()));
        if (this.allowReflection) {
            let reflected = piece.reflect();
            orientations.push(reflected);
            if (this.allowRotation) orientations.push(...[1,2,3].map(i => reflected.rotate(i).getMinimalNonNegative()));
        }

        for (let config of orientations) {

            for (var dx = 0; dx < this.width; dx ++) {
                for (var dy = 0; dy < this.height; dy ++) {
                    let translated = config.translate(dx, dy);
                    if (this._fits(translated)) yield translated;
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
            let pset = Array.from(this._generateAllPossibleForPiece(piece));
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

        return { cnfProblem: cnf.getCNFProblem(), interpreter };

    }

}
