import Polyomino from './Polyomino.js';
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg-min.js';
import Please from 'pleasejs';

const _intTransform = x => parseInt(x, 10);

export default class PolyominoControl extends HTMLElement {

    constructor() {
        super();
    }

    init() {
        let shadowRoot = this.attachShadow({mode: 'open'});
        let svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.style.display = 'inherit';
        svgEl.style.width = 'inherit';
        svgEl.style.height = 'inherit';
        shadowRoot.appendChild(svgEl);

        this.paper = Snap(svgEl);

        if (!this.hasAttribute('size')) this.setAttribute('size', 6);
        if (!this.hasAttribute('padding')) this.setAttribute('padding', 5);
        if (!this.hasAttribute('mode')) this.setAttribute('mode', 'create-poly');
    }

    // Reflect certain properties as attributes:

    get size()          { return _intTransform(this.getAttribute('size')) }
    set size(arg)       { this.setAttribute('size', arg) }

    get padding()       { return _intTransform(this.getAttribute('padding')) }
    set padding(arg)    { this.setAttribute('padding', arg) }

    get mode()          { return this.getAttribute('mode') }
    set mode(arg)       { this.setAttribute('mode', arg) }

    connectedCallback() {
        this.init();
        this.setPolyomino(null);
    }

    _calcGeometry() {
        let width = parseInt(window.getComputedStyle(this).getPropertyValue('width'), 10);
        let height = parseInt(window.getComputedStyle(this).getPropertyValue('height'), 10);

        this.realWidth = width - this.padding*2;
        this.realHeight = height - this.padding*2;

        this.distX = this.realWidth / this.size;
        this.distY = this.realHeight / this.size;

        this.originX = this.padding;
        this.originY = height - this.padding - this.distY;

        this.strokeWidth = Math.round(this.realHeight * 0.015);
        if (this.strokeWidth < 2) this.strokeWidth = 2;
        if (this.strokeWidth > 5) this.strokeWidth = 5;
    }

    _updateRect(r, state) {
        if (this.mode == 'create-poly') {
            r.attr({
                fill: state ? 'dodgerblue' : 'white',
                opacity: 1,
            });
        }
        if (this.mode == 'create-region') {
            r.attr({
                fill: state ? 'white' : 'darkgray',
                opacity: state ? 1 : 0.2,
            });
        }
        if (this.mode == 'display') {
            r.attr({
                fill: state ? 'dodgerblue' : 'white',
                opacity: 1,
            });
        }
    }

    _makeRect(x, y, initialState) {
        let r = this.paper.rect(this.originX + x * this.distX, this.originY - y * this.distY, this.distX, this.distY);
        r.attr({
            stroke: 'black',
            strokeWidth: this.strokeWidth,
        });

        this._updateRect(r, initialState);

        if (this.mode == 'create-poly' || this.mode == 'create-region') {
            r.touchstart(event => {
                this._touchFlag = true;
                this.state[x][y] = !this.state[x][y];
                this._updateRect(r, this.state[x][y]);
                event.stopPropagation();
                event.preventDefault();
            });
            r.mousedown(event => {
                if (this._touchFlag) return;
                this.state[x][y] = !this.state[x][y];
                this._updateRect(r, this.state[x][y]);
                event.preventDefault();
            });
            r.mouseover(event => {
                if (this._touchFlag) return;
                if (event.buttons == 1) {
                    this.state[x][y] = !this.state[x][y];
                    this._updateRect(r, this.state[x][y]);
                    event.preventDefault();
                }
            });
        }
    }

    redraw() {
        let cutoff = this._cutoffPolyomino(this.getPolyomino(), this.size);
        this.setPolyomino(cutoff);
    }

    setPolyomino(poly=null, fit=false, preserveCurrentState=false) {

        this.paper.clear();

        if (poly != null && fit) {
            this.size = Math.max(poly.getWidth(), poly.getHeight());
        }

        this._calcGeometry();

        // Init a size X size grid of booleans
        let newState = [];
        for (let x = 0; x < this.size; x ++) {
            let row = [];
            for (let y = 0; y < this.size; y ++) {
                row.push(false);
            }
            newState.push(row);
        }

        // Fill in with the Polyomino if given
        if (poly != null) {
            let nonneg = poly.getMinimalNonNegative();
            for (let c of nonneg.coords) {
                let [x, y] = c;
                newState[x][y] = true;
            }
        }

        this.state = preserveCurrentState ? this.state : newState;

        // Draw
        for (let x = 0; x < this.size; x ++) {
            for (let y = 0; y < this.size; y ++) {
                let on = this.state[x][y];
                if (on || (this.mode != 'display')) this._makeRect(x, y, on);
            }
        }
    }

    // only works in display-multiple mode
    setMultiplePolyominosWithBackground(polys, background) {

        this.paper.clear();

        let rects = [];
        for (var x = 0; x < this.size; x ++) {
            let row = [];
            for (var y = 0; y < this.size; y ++) {
                row.push(null);
            }
            rects.push(row);
        }

        for (var x = 0; x < this.size; x ++) {
            for (var y = 0; y < this.size; y ++) {
                let r = this.paper.rect(this.originX + x * this.distX, this.originY - y * this.distY, this.distX, this.distY);
                r.attr({
                    stroke: 'black',
                    strokeWidth: this.strokeWidth,
                    fill: 'darkgray',
                    opacity: 0.2,
                });
                rects[x][y] = r;
            }
        }

        for (var c of background.coords) {
            let [x, y] = c;
            rects[x][y].attr({
                fill: 'white',
                opacity: 1
            });
        }

        var dHue = Math.round(360 / polys.length);
        var h = Math.floor(Math.random() * 360);

        for (var poly of polys) {

            h = (h + dHue) % 360;
            var color = Please.make_color({golden: false, hue: h, saturation: 0.8});

            for (var c of poly.coords) {
                let [x, y] = c;
                rects[x][y].attr({
                    fill: color,
                    opacity: 1
                });
            }
        }

    }

    getPolyomino() {
        let coords = [];
        let limit = Math.min(this.size, this.state.length);
        for (let x = 0; x < limit; x ++) {
            for (let y = 0; y < limit; y ++) {
                if (this.state[x][y]) coords.push([x, y]);
            }
        }
        if (coords.length > 0) {
            let p = new Polyomino(coords);
            return p.getMinimalNonNegative();
        } else {
            return null;
        }
    }

    _cutoffPolyomino(p, size) {
        if (p != null) {
            let newCoords = p.coords.filter(([x, y]) => x < size && y < size);
            return (newCoords.length > 0) ? new Polyomino(newCoords) : null;
        } else {
            return null;
        }
    }

}
