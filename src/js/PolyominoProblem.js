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

    _generateAllPossibleForPiece(piece) {
        let orientations = [];

        orientations.push(piece.rotate(0));

        if (this.allowRotation) {
            for (var i = 1; i < 4; i ++) {
                orientations.push(piece.rotate(i).getMinimalNonNegative());
            }
        }

        if (this.allowReflection) {
            let reflected = piece.reflect();
            orientations.push(reflected);
            if (this.allowRotation) {
                for (var i = 1; i < 4; i ++) {
                    orientations.push(reflected.rotate(i).getMinimalNonNegative());
                }
            }
        }

        var total = [];

        for (let config of orientations) {

            for (var dx = 0; dx < this.width; dx ++) {
                for (var dy = 0; dy < this.height; dy ++) {
                    let translated = config.translate(dx, dy);
                    if (this._fits(translated)) total.push(translated);
                }
            }

        }

        return total;
    }

    convertToSAT() {

        // Here we go.

        // First, generate all the possible ways each piece can be:

        let pieceConfigurations = this.pieces.map(x => this._generateAllPossibleForPiece(x));

        let pieceData = [];
        let curVariableOffset = 1;
        for (var pset of pieceConfigurations) {
            let closure_pset = pset;
            let closure_offset = curVariableOffset;

            let data = {
                varsOffset: curVariableOffset,
                varsLength: pset.length,
                varsEnd: curVariableOffset + pset.length,
                getCorrespondingPolyConfiguration: varIndex => {
                    // This closes over the variables pset and frozenOffset, to provide a way to get the particular Polyomino associated with a variable
                    if ((varIndex - closure_offset) >= 0 && (varIndex - closure_offset) < closure_pset.length) return closure_pset[varIndex - closure_offset];
                    return null;
                }
            }

            curVariableOffset += pset.length;
            pieceData.push(data);
        }

        let cnf = new CNFBuilder();

        // Encode the fact that one piece can't exist in multiples orientations/places

        for (var data of pieceData) {

            for (var v = data.varsOffset; v < data.varsEnd; v ++) {
                for (var w = v+1; w < data.varsEnd; w ++) {

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

        for (var data of pieceData) {

            // One clause that OR's all of the configurations

            cnf.beginClause();
            for (var v = data.varsOffset; v < data.varsEnd; v ++) {
                cnf.add(v);
            }
            cnf.endClause();

        }

        for (var i = 0; i < pieceData.length; i ++) {
            for (var j = i+1; j < pieceData.length; j ++) {

                // Do it that way to be non-redunant with the combinations

                var [data, otherData] = [pieceData[i], pieceData[j]];

                for (var v = data.varsOffset; v < data.varsEnd; v ++) {
                    for (var w = otherData.varsOffset; w < otherData.varsEnd; w ++) {

                        let [configOfPiece, configOfOtherPiece] = [data.getCorrespondingPolyConfiguration(v), otherData.getCorrespondingPolyConfiguration(w)];

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

        // Now, a utility function for the client to get the polyomino configuration corresponding to a variable:

        this._savedPieceData = pieceData;

        return cnf.getCNFProblem();

    }

    _retrievePolyConfigurationForVariable(v) {
        if (this._savedPieceData == null) {
            throw 'PolyominoProblem has not been converted to SAT yet';
        }

        for (let data of this._savedPieceData) {
            let maybe = data.getCorrespondingPolyConfiguration(v);
            if (maybe != null) return maybe;
        }
    }

    interpretSATSolution(solution) {
        let polys = [];
        for (var i = 1; i < solution.length; i ++) {
            if (solution[i]) {
                polys.push(this._retrievePolyConfigurationForVariable(i));
            }
        }
        return polys;
    }

}
