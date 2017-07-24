export default class CNFBuilder {

    constructor() {
        this.clauses = [];
        this._curClause = null;
        this.numVars = 0;
    }

    beginClause() {
        this._curClause = [];
    }

    add(v) {
        if (this._curClause != null) {
            this._curClause.push(v);
            if (v > this.numVars) this.numVars = v;
        } else {
            throw 'add or addNot called without beginClause';
        }
    }

    addNot(v) {
        this.add(-v);
    }

    endClause() {
        this.clauses.push(this._curClause);
        this._curClause = null;
    }

    getCNFProblem() {
        return {
            numVars: this.numVars,
            clauseList: this.clauses
        };
    }

}
