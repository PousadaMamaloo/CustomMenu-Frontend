import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuth } from './composables/useAuth';

// Estilos e bibliotecas
import './style.css';
import '@mdi/font/css/materialdesignicons.css';
import { VueMaskDirective } from 'v-mask';
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const { initializeAuth } = useAuth();

const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
  beforeMount: vMaskV2.bind,
  updated: vMaskV2.componentUpdated,
  unmounted: vMaskV2.unbind,
};

async function startApp() {
  await initializeAuth();

  const app = createApp(App);

  app.directive('mask', vMaskV3);
  
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
}

startApp();
