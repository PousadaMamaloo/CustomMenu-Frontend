import { createApp } from 'vue';
import { createPinia } from 'pinia'; 
import App from './App.vue';
import router from './router';

import './style.css';
import '@mdi/font/css/materialdesignicons.css';
import { VueMaskDirective } from 'v-mask';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

const pinia = createPinia();

const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
  beforeMount: vMaskV2.bind,
  updated: vMaskV2.componentUpdated,
  unmounted: vMaskV2.unbind,
};
app.directive('mask', vMaskV3);

app.use(pinia); 
app.use(router);

app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
});

app.mount('#app');