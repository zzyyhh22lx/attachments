import { createApp } from 'vue';
import { createAssetsMonitor } from '@attachments/monitor';
import App from './app.vue';
import router from "./router";
const app = createApp(App);
app.use(router).mount('#app');

// createAssetsMonitor();
