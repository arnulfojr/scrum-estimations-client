import Vue from "vue";
import Router from "vue-router";

// views
import Home from "./views/Home.vue";

// components
import Callback from "./components/Callback.vue";

// services
import authService from "./services/AuthService";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/callback",
    name: "callback",
    component: Callback
  },
  {
    path: "/organization",
    name: "organization",
    component: () => import(/* webpackChunkName: "organizatio" */ "./views/Organization")
  }
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

/* Allow only the specified paths to be unauthenticated */
router.beforeEach((to, from, next) => {
  function isPathAllowed(path) {
    return path === "/" || path === "/callback";
  }

  if (isPathAllowed(to.path) || authService.isAuthenticated()) {
    return next();
  }

  authService.login({ target: to.path });
});

export default router;
