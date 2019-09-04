import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// plugins
import AuthPlugin from "./plugins/auth";
import BootstrapVue from "bootstrap-vue";

// styles
import "./assets/custom.scss";

import store from "./store";

Vue.use(AuthPlugin);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
