import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const MUTATION_TYPES = {
  SET_USER: 'SET_USER',
  SET_ORGANIZATION: 'SET_ORGANIZATION',
  SET_ACCESS_TOKEN: 'SET_ACCESS_TOKEN'
};

export default new Vuex.Store({
  state: {
    user: null,
    organization: null,
    accessToken: null
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
    }
  },
  actions: {}
})
