import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import router from './router';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(router);
app.use(VueReCaptcha, { siteKey: '6LdhaK0eAAAAAHL5vXc7M7zs9KPCDZ3CbbLLlFN6' });
app.directive('tooltip', Tooltip);

app.mount('#app');
