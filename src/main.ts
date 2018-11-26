import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';

library.add(faCheckCircle);
library.add(faTimesCircle);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
