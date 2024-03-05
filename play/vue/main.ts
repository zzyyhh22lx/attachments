import { createApp } from 'vue';
import { createAssetsMonitor } from '@attachments/monitor';
import App from './app.vue';

const app = createApp(App);
app.mount('#app');

// createAssetsMonitor();
