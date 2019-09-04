import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const MUTATION_TYPES = {
  SET_USER: "SET_USER",
  SET_ORGANIZATION: "SET_ORGANIZATION",
  SET_ACCESS_TOKEN: "SET_ACCESS_TOKEN",
  SET_SEQUENCES: "SET_SEQUENCES"
};

export default new Vuex.Store({
  state: {
    user: null,
    organization: null,
    accessToken: null,
    sequences: []
  },
  mutations: {
    [MUTATION_TYPES.SET_USER]: (state, user = {}) => {
      state.user = user;
    },
    [MUTATION_TYPES.SET_ORGANIZATION]: (state, organization = {}) => {
      state.organization = organization;
    },
    [MUTATION_TYPES.SET_ACCESS_TOKEN]: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    [MUTATION_TYPES.SET_SEQUENCES]: (state, sequences = []) => {
      state.sequences = sequences;
    }
  },
  actions: {}
});
