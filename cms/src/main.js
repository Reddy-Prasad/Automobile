import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { installGuards } from './router/guards'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
installGuards(router)
app.use(router)

app.mount('#app')
