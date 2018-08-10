import Polyomino, {tetrominos} from './Polyomino.js';
import PolyominoProblem from './PolyominoProblem.js';
import SatSolverWorker from 'worker-loader!./SatSolverWorker.js';

export default class Application {

    init() {

        let solveButton = document.getElementById('solve-button');
        solveButton.disabled = true;
        solveButton.innerHTML = 'Loading ...';
        solveButton.classList.add('disabled');

        document.querySelectorAll('.method-select').forEach(node => {
            node.addEventListener('click', event => {
                document.querySelectorAll('.method-select').forEach(node => node.checked = false);
                event.target.checked = true;
            });
        });

        this.worker = new SatSolverWorker();
        this.worker.onmessage = event => this.handleWorkerMessage(event);

        document.getElementById('add-button').addEventListener('click', event => {

            // Save the Polyomino from the custom creation
            let poly = document.getElementById('poly-create').getPolyomino();
            if (poly != null) this.addSavedPolyomino(poly);

        });

        // Populate standard tetrominos
        for (let polyName in tetrominos) {
            let el = document.createElement('polyomino-control');
            el.style.cssText = 'width: 60px; height: 60px; display: inline-block;';
            el.size = 4;
            el.mode = 'display';
            document.getElementById('standard-container').appendChild(el);

            el.setPolyomino(tetrominos[polyName], false);

            el.addEventListener('click', event => {
                let poly = el.getPolyomino();
                this.addSavedPolyomino(poly);
            });
        }

        // Size controls
        document.getElementById('size-up-button').addEventListener('click', event => {
            let el = document.getElementById('region-create');
            el.size += 1;
            if (el.size > 20) el.size = 20;
            el.redraw();
        });

        document.getElementById('size-down-button').addEventListener('click', event => {
            let el = document.getElementById('region-create');
            el.size -= 1;
            if (el.size < 2) el.size = 2;
            el.redraw();
        });

        // Solve button
        document.getElementById('solve-button').addEventListener('click', event => {

            document.getElementById('no-solution').style.display = 'none';

            let polys = [];
            for (let polyControl of document.getElementById('poly-container').children) {
                polys.push(polyControl.getPolyomino());
            }

            let region = document.getElementById('region-create').getPolyomino();

            let solveMethod = document.querySelector('.method-select:checked').id.split('-')[1];

            let polyProblem = new PolyominoProblem(polys, region);
            let { convertedProblem, interpreter } =
                solveMethod == 'sat' ? polyProblem.convertToSAT() :
                solveMethod == 'z3' ? polyProblem.convertToZ3() :
                polyProblem.convertToZ3();

            this.currentlySolving = { polyProblem, convertedProblem, interpreter };

            // Kick it off with the sat problem
            // this.worker.postMessage({ type: 'sat', problem: convertedProblem });
            this.worker.postMessage({ type: solveMethod, problem: convertedProblem });

            document.getElementById('loading').style.display = 'block';

        });

        // Clear button
        document.getElementById('clear-button').addEventListener('click', event => {

            let disp = document.getElementById('region-create');
            disp.mode = 'create-region';
            disp.setPolyomino(null);

            document.getElementById('clear-button').style.display = 'none';
            document.getElementById('no-solution').style.display = 'none';

        });
    }

    // Adds a polyomino-control displaying poly to the bottom area; returns the new element
    addSavedPolyomino(poly) {
        let el = document.createElement('polyomino-control');
        el.style.cssText = 'width: 50px; height: 50px; display: inline-block';
        el.mode = 'display';
        document.getElementById('poly-container').appendChild(el);

        el.setPolyomino(poly, true);

        el.addEventListener('click', event => {
            el.remove();
        });

        return el;
    }

    handleWorkerMessage(event) {
        if (event.data == 'ready') {
            let solveButton = document.getElementById('solve-button');
            solveButton.disabled = false;
            solveButton.innerHTML = 'Solve';
            solveButton.classList.remove('disabled');
            return;
        }

        let solution = event.data.solution;

        if (solution) {
            let solutionPolys = this.currentlySolving.interpreter(solution);

            let disp = document.getElementById('region-create');
            disp.mode = 'display-multiple';
            disp.setMultiplePolyominosWithBackground(solutionPolys, this.currentlySolving.polyProblem.region);
        } else {
            document.getElementById('no-solution').style.display = 'block';
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('clear-button').style.display = 'block';
    }
    
}
