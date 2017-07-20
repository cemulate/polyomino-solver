// CSS
import 'foundation-sites/dist/css/foundation.css';

// Custom elements
import './PolyominoControl.js';

// Rest
import Polyomino from './Polyomino.js';


var savedPolyominos = [];

document.getElementById('add-button').addEventListener('click', event => {

    // Save the Polyomino from the custom creation
    let poly = document.getElementById('poly-create').getPolyomino();

    let el = document.createElement('polyomino-control');
    el.style.width = '50px';
    el.style.height = '50px';
    el.mode = 'display';

    document.getElementById('poly-container').insertAdjacentElement('beforeend', el);

    el.setPolyomino(poly, true);

    savedPolyominos.push(el);

});
