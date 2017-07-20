import Polyomino from './Polyomino.js';
import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg';

const _intTransform = x => parseInt(x, 10);

class PolyominoControl extends HTMLElement {

    constructor() {
        super();
    }

    init() {
        this.style.display = 'inline-block';

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

    attributeChangedCallback(name, old, current) {
        console.log(name, old, current);
    }

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
        if (this.strokeWidth > 6) this.strokeWidth = 6;
    }

    _makeRect(x, y, initialState) {
        let r = this.paper.rect(this.originX + x * this.distX, this.originY - y * this.distY, this.distX, this.distY);
        r.attr({
            stroke: 'black',
            strokeWidth: this.strokeWidth,
            fill: initialState ? 'dodgerblue' : 'white',
        });
        if (this.mode != 'display') {
            r.click(() => {
                this.state[x][y] = !this.state[x][y];
                r.attr({
                    fill: this.state[x][y] ? 'dodgerblue' : 'white',
                });
            });
        }
    }

    setPolyomino(poly=null, fit=false) {

        this.paper.clear();

        if (poly != null && fit) {
            this.size = Math.max(poly.getWidth(), poly.getHeight());
        }

        this._calcGeometry();

        // Init a size X size grid of booleans
        this.state = [];
        for (let x = 0; x < this.size; x ++) {
            let row = [];
            for (let y = 0; y < this.size; y ++) {
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
        for (let x = 0; x < this.size; x ++) {
            for (let y = 0; y < this.size; y ++) {
                let on = this.state[x][y];
                if (on || (this.mode != 'display')) this._makeRect(x, y, on);
            }
        }
    }

    getPolyomino() {
        let coords = [];
        for (let x = 0; x < this.size; x ++) {
            for (let y = 0; y < this.size; y ++) {
                if (this.state[x][y]) coords.push([x, y]);
            }
        }
        let p = new Polyomino(coords);
        return p.getMinimalNonNegative();
    }

}

window.customElements.define('polyomino-control', PolyominoControl);
