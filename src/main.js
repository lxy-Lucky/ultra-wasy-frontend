import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
/* 引入ElementPlusUI */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '@/styles/index.scss'
/* 加载ElementPlusIconsVue */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/* 加载axios */
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus, {size: 'small', zIndex: 3000})

app.mount('#app')
