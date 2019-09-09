import Vue from "vue";
import Vuex from "vuex";

// root stuff
import mutations from "./mutations";
import actions from "./actions";

// modules
import sequences from "./modules/sequences";
import organizations from "./modules/organizations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: null,
    organization: null,
    selectedSequence: null,
    sequences: [],
    sessions: [],
    user: null
  },
  modules: {
    organizations,
    sequences
  },
  mutations,
  actions
});
