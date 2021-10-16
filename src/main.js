import App from './App.svelte';
import './styles/reset.css';
import './styles/style.css';
import './lib/initialize.js';

const app = new App({
  target: document.getElementById('app')
})

export default app
