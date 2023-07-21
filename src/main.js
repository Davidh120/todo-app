import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ToDo from './ToDo.vue'
import router from './router'

const toDo = createApp(ToDo)
toDo.use(createPinia())
toDo.mount('#toDo')
