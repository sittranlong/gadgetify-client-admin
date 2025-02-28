import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'
import i18n from "@/configs/i18n.js";
import App from './App.vue'
import router from './router'
import {LoadingPlugin} from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import axiosConfig from "@/configs/axios.js";

const app = createApp(App)
app.use(i18n)
app.use(LoadingPlugin)
app.use(createPinia())
axiosConfig()
app.use(router)

app.mount('#app')
