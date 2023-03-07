import {createApp} from 'vue'
import {createPinia} from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
/* 引入ElementPlusUI */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
/* 加载ElementPlusIconsVue */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/* 加载axios */
import axios from 'axios'
import VueAxios from 'vue-axios'
import { loadLang } from '/@/lang/index'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 全局语言包加载
const i18n = await loadLang(app)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus, {size: 'small', zIndex: 3000, i18n: i18n.global.t})

app.mount('#app')
