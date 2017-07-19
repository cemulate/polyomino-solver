import Polyomino from './Polyomino.js';
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg';

export const DisplayModes = {
    DISPLAY: Symbol("display"),
    CREATE_POLY: Symbol("create_poly"),
    CREATE_REGION: Symbol("create_region")
};

export default class PolyominoDisplay {

    constructor(svgEl, settings) {
        this.paper = (svgEl != null) ? Snap(svgEl) : Snap();

        this.settings = {
            width: settings.width,
            height: settings.height,
            size: settings.size || 6,
            padding: settings.padding || 5,
            mode: settings.mode || DisplayModes.CREATE_POLY,
        };

        this.initCalc();
    }

    getDOMNode() {
        return this.paper.node;
    }

    initCalc() {
        this.width = this.settings.width - this.settings.padding*2;
        this.height = this.settings.height - this.settings.padding*2;

        this.distX = this.width / this.settings.size;
        this.distY = this.height / this.settings.size;

        this.originX = this.settings.padding;
        this.originY = this.settings.height - this.settings.padding - this.distY;

        this.strokeWidth = Math.round(this.height * 0.015);
        if (this.strokeWidth < 2) this.strokeWidth = 2;
        if (this.strokeWidth > 6) this.strokeWidth = 6;
    }

    _makeRect(x, y, initialState) {
        let r = this.paper.rect(this.originX + x * this.distX, this.originY - y * this.distY, this.distX, this.distY);
        r.attr({
            stroke: 'black',
            strokeWidth: this.strokeWidth,
            fill: initialState ? 'dodgerblue' : 'white',
        });
        if (this.settings.mode != DisplayModes.DISPLAY) {
            r.click(() => {
                this.state[x][y] = !this.state[x][y];
                r.attr({
                    fill: this.state[x][y] ? 'dodgerblue' : 'white',
                });
            });
        }
    }

    setBlank() {
        this.setPolyomino(null);
    }

    setPolyomino(poly=null, fit=false) {

        this.paper.clear();

        if (poly != null && fit) {
            this.settings.size = Math.max(poly.getWidth(), poly.getHeight());
            this.initCalc();
        }

        // Init a size X size grid of booleans
        this.state = [];
        for (let x = 0; x < this.settings.size; x ++) {
            let row = [];
            for (let y = 0; y < this.settings.size; y ++) {
                row.push(false);
            }
            this.state.push(row);
        }

        // Fill in with the Polyomino if given
        if (poly != null) {
            let nonneg = poly.getMinimalNonNegative();
            for (let c of nonneg.coords) {
                let [x, y] = c;
                this.state[x][y] = true;
            }
        }

        // Draw
        for (let x = 0; x < this.settings.size; x ++) {
            for (let y = 0; y < this.settings.size; y ++) {
                let on = this.state[x][y];
                if (on || (this.settings.mode != DisplayModes.DISPLAY)) this._makeRect(x, y, on);
            }
        }
    }

    getPolyomino() {
        let coords = [];
        for (let x = 0; x < this.settings.size; x ++) {
            for (let y = 0; y < this.settings.size; y ++) {
                if (this.state[x][y]) coords.push([x, y]);
            }
        }
        let p = new Polyomino(coords);
        return p.getMinimalNonNegative();
    }

}
