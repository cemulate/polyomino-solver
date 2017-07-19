import 'foundation-sites/dist/css/foundation.css';

import Polyomino from './Polyomino.js';
import PolyominoDisplay, {DisplayModes} from './PolyominoDisplay.js';

// Correct height of custom polyomino display
let customDisplay = document.getElementById('custom-display');
let cwidth = window.getComputedStyle(customDisplay).getPropertyValue('width');
customDisplay.style.height = cwidth;
let size = parseInt(cwidth.replace('px', ''), 10);

// Initialize interactive polyomino display
let customPolyomino = new PolyominoDisplay(customDisplay, {width: size, height: size});
customPolyomino.setBlank();

var savedPolyominos = [];

document.getElementById('add-button').addEventListener('click', event => {

    // Save the Polyomino from the custom creation
    let poly = customPolyomino.getPolyomino();

    // Creates new DOM element
    let disp = new PolyominoDisplay(null, {width: 50, height: 50, size: 2, mode: DisplayModes.DISPLAY});

    let el = disp.getDOMNode();
    el.style.width = '50px';
    el.style.height = '50px';
    document.getElementById('poly-container').insertAdjacentElement('beforeend', el);

    disp.setPolyomino(poly, true);

    savedPolyominos.push(disp);

});
