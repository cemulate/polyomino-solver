import { Polyomino, tetrominos } from './Polyomino.js';
import PolyominoProblem from './PolyominoProblem.js';
import SatSolverWorker from 'worker-loader!./SatSolverWorker.js';

export default class Application {

    init() {
        {
          this.state = JSON.parse(
            localStorage.getItem("polyomino-solver-state")
          ) || {
            savedPolyomino: [],
            size: 10,
            regionCoords: null,
          };
          for (let coords of this.state.savedPolyomino) {
            this.addSavedPolyomino(coords);
          }
          let el = document.getElementById("region-create");
          el.size = this.state.size || 10;
          if (this.state.regionCoords) {
            el.value =
              el.mode == "display-multiple"
                ? [this.state.regionCoords]
                : this.state.regionCoords;
          }
          setInterval(() => {
            let regionDisplay = document.getElementById("region-create");
            let regionCoords =
              regionDisplay.mode == "display-multiple"
                ? regionDisplay.value[0]
                : regionDisplay.value;
            let savedPolyomino = [];
            for (let polyControl of document.getElementById("poly-container")
              .children) {
              savedPolyomino.push(polyControl.value);
            }
            const state = {
              savedPolyomino,
              size: document.getElementById("region-create").size,
              regionCoords,
            };
            localStorage.setItem(
              "polyomino-solver-state",
              JSON.stringify(state)
            );
          }, 1500);
        }

        document.querySelectorAll('.method-select').forEach(node => {
            node.addEventListener('click', event => {
                document.querySelectorAll('.method-select').forEach(node => node.checked = false);
                event.target.checked = true;
            });
        });

        document.querySelector('#method-z3').addEventListener('click', event => {
            this.worker.postMessage('loadZ3');
            let solveButton = document.getElementById('solve-button');
            solveButton.disabled = true;
            solveButton.innerHTML = 'Loading Z3 ...';
            solveButton.classList.add('disabled');
        });

        this.worker = new SatSolverWorker();
        this.worker.onmessage = event => this.handleWorkerMessage(event);

        document.getElementById('add-button').addEventListener('click', event => {

            // Save the Polyomino from the custom creation
            let coords = document.getElementById('poly-create').value;
            if (coords.length > 0) this.addSavedPolyomino(coords);

        });

        // Populate standard tetrominos
        for (let polyName in tetrominos) {
            let el = document.createElement('polyomino-control');
            el.classList.add('tetromino');
            el.size = 4;
            el.mode = 'display';
            document.getElementById('standard-container').appendChild(el);

            el.value = tetrominos[polyName].coords;

            el.addEventListener('click', event => {
                if (el.value.length > 0) this.addSavedPolyomino(el.value);
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
                polys.push(new Polyomino(polyControl.value));
            }

            let regionDisplay = document.getElementById('region-create');
            let regionCoords = regionDisplay.mode == 'display-multiple' ? regionDisplay.value[0] : regionDisplay.value;

            let region = new Polyomino(regionCoords);

            let solveMethod = document.querySelector('.method-select:checked').id.split('-')[1];

            let polyProblem = new PolyominoProblem(polys, region);
            let { convertedProblem, interpreter } =
                solveMethod == 'sat' ? polyProblem.convertToSAT() :
                solveMethod == 'z3' ? polyProblem.convertToZ3() :
                solveMethod == 'dlx' ? polyProblem.convertToDlx() :
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
            disp.value = [];

            document.getElementById('clear-button').style.display = 'none';
            document.getElementById('no-solution').style.display = 'none';

            document.querySelectorAll('.size-button').forEach(node => {
                node.disabled = false;
                node.classList.remove('disabled');
            });

        });
    }

    // Adds a polyomino-control displaying poly to the bottom area; returns the new element
    addSavedPolyomino(coords) {
        let el = document.createElement('polyomino-control');
        el.style.cssText = 'width: 50px; height: 50px; display: inline-block; margin-right: 10px; vertical-align: top';
        el.mode = 'display';
        document.getElementById('poly-container').appendChild(el);

        let poly = new Polyomino(coords).normalize();
        el.size = poly.getSize();
        el.value = [ ...poly.coords ];

        el.addEventListener('click', event => {
            el.remove();
        });

        return el;
    }

    handleWorkerMessage(event) {
        if (event.data == 'z3Loaded') {
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
            // disp.setMultiplePolyominosWithBackground(solutionPolys, this.currentlySolving.polyProblem.region);
            disp.value = [ this.currentlySolving.polyProblem.region.coords, ...solutionPolys.map(x => x.coords) ];
            document.querySelectorAll('.size-button').forEach(node => {
                node.disabled = true;
                node.classList.add('disabled');
            });
        } else {
            document.getElementById('no-solution').style.display = 'block';
        }

        document.getElementById('loading').style.display = 'none';
        document.getElementById('clear-button').style.display = 'block';
    }
    
}
