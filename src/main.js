import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// plugins
import AuthPlugin from "./plugins/auth";
import BootstrapVue from "bootstrap-vue";

// styles
import "./assets/custom.scss";

Vue.use(AuthPlugin);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
