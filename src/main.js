import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ToDo from './ToDo.vue'
import router from './router'

import './assets/main.css'

const toDo = createApp(ToDo)
toDo.use(createPinia())
toDo.mount('#toDo')
