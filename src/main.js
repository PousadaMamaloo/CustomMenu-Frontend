import App from './App.vue';
import router from './router';
import { useAuth } from './composables/useAuth';

import { createApp } from 'vue'
import './style.css';
import '@mdi/font/css/materialdesignicons.css';
import { VueMaskDirective } from 'v-mask';

import Toast, { POSITION } from 'vue-toastification'
// Importe o CSS da biblioteca de toast
import 'vue-toastification/dist/index.css'


const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
  beforeMount: vMaskV2.bind,
  updated: vMaskV2.componentUpdated,
  unmounted: vMaskV2.unbind,
};

const app = createApp(App);
app.directive('mask', vMaskV3);
app.use(router);
app.use(Toast, {
  position: POSITION.TOP_RIGHT, // Posição padrão dos toasts
  timeout: 3000, // Tempo padrão em milissegundos para o toast desaparecer (3 segundos)
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
  transition: "Vue-Toastification__bounce", // Animação padrão
  maxToasts: 5, // Número máximo de toasts visíveis ao mesmo tempo
  newestOnTop: true // Toasts mais recentes aparecem no topo
});

// Inicializar estado de autenticação
const { initializeAuth } = useAuth();
initializeAuth();

app.mount('#app');
