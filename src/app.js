// CSS
import './styles/theme.scss';

// Images
import loadingGif from './assets/loading.gif';
document.getElementById('loading-image').src = loadingGif;

// Custom elements
import PolyominoControl from './js/PolyominoControl.js';
window.customElements.define('polyomino-control', PolyominoControl);

// Main functionality
import Application from './js/Application.js';

const app = new Application();
app.init();
