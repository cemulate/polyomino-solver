// CSS
import './styles/theme.scss';

// Images
import loadingGif from './assets/loading.gif';
document.getElementById('loading-image').src = loadingGif;

import 'web-component-polyomino';

// Main functionality
import Application from './js/Application.js';

const app = new Application();
app.init();
