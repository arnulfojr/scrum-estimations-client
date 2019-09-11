import Vue from "vue";
import Vuex from "vuex";

// root stuff
import mutations from "./mutations";
import actions from "./actions";

// modules
import auth from "./modules/auth";
import organizations from "./modules/organizations";
import sequences from "./modules/sequences";
import sessions from "./modules/sessions";
import users from "./modules/users";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    auth,
    organizations,
    sequences,
    sessions,
    users
  },
  mutations,
  actions
});
