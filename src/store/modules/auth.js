import authService from "@/services/AuthService";

const actions = {
  async setAccessToken({ commit }) {
    let accessToken = null;
    try {
      accessToken = await authService.getAccessToken();
    } catch (error) {
      /* ignore */
    }

    commit("SET_ACCESS_TOKEN", accessToken);
    return accessToken;
  },
  async renewTokens() {
    return authService.renewTokens();
  }
};

const getters = {};

const mutations = {
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken;
  }
};

const state = {
  accessToken: null
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
