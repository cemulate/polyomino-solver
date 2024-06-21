// CSS
import './styles/theme.scss';

import Plausible from 'plausible-tracker';
Plausible({
    domain: 'cemulate.github.io/polyomino-solver',
    apiHost: 'https://plausible.351321.xyz',
}).enableAutoPageviews();

import 'web-component-polyomino';

import App from './App.svelte';
const app = new App({
    target: document.body,
});
