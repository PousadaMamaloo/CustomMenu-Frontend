import App from './App.vue';
import router from './router';

import { createApp } from 'vue'
import './style.css';
import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue'
import router from './router'
import { VueMaskDirective } from 'v-mask';

import './style.css'
import '@mdi/font/css/materialdesignicons.css'

const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
  beforeMount: vMaskV2.bind,
  updated: vMaskV2.componentUpdated,
  unmounted: vMaskV2.unbind,
};

const app = createApp(App);
app.directive('mask', vMaskV3);
app.use(router);
app.mount('#app');