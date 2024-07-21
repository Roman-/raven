import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import './input.css';
import { store } from './store/store';

createApp(App).use(router).use(store).mount('#app');
