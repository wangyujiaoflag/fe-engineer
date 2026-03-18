import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
// import * as Sentry from '@sentry/vue'
import { router } from '@/router/index'

// if (import.meta.env.VITE_USE_MOCK === 'true') {
//   // 动态导入 mock 配置，仅在开发环境加载
//   import('../mock/_createProductionServer').then(({ setupProdMockServer }) => setupProdMockServer())
// }

const app = createApp(App)
app.use(router).use(createPinia())
app.mount('#app')
// Sentry.init({
//   app,
//   dsn: '__PUBLIC_DSN__',
//   integrations: [Sentry.browserTracingIntegration({})],
// })
