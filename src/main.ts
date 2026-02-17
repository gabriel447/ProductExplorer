// Ponto de entrada da aplicação
// Responsabilidades: criar app Vue, registrar Pinia e router e montar na DOM
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

if (typeof window !== 'undefined') {
  let lastTouchEnd = 0

  window.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    { passive: false },
  )
}
