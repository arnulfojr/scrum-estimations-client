import authService from "@/services/AuthService";

export default {
  install(Vue) {
    Vue.prototype.$auth = authService;

    const loginEvent = "loginEvent";

    Vue.mixin({
      created() {
        if (this.handleLoginEvent) {
          authService.addListener(loginEvent, this.handleLoginEvent);
        }
      },
      destroyed() {
        if (this.handleLoginEvent) {
          authService.removeListener(loginEvent, this.handleLoginEvent);
        }
      }
    });
  }
};
