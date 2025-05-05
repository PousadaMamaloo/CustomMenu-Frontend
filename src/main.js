import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './style.css'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
