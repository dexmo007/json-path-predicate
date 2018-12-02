import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle, faTimesCircle, faSearch, faCaretLeft,
} from '@fortawesome/free-solid-svg-icons';
import App from './App.vue';

library.add(faCheckCircle);
library.add(faTimesCircle);
library.add(faSearch);
library.add(faCaretLeft);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
