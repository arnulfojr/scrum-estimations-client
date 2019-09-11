// sessions module
import sessionService from "@/services/SessionService";

const actions = {
  async fetchForOrganization({ commit, dispatch }, { organizationId }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    sessionService.accessToken = accessToken;

    let sessions = [];
    try {
      sessions = await sessionService.sessionFromOrganization(organizationId);
    } catch (error) {
      /* ignore */
    }

    commit("SET_SESSIONS", sessions);

    return sessions;
  }
};

const getters = {};

const mutations = {
  SET_SESSION: (state, session = {}) => {
    state.session = session;
  },
  SET_SESSIONS: (state, sessions = []) => {
    state.sessions = sessions;
  }
};

const state = {
  session: null,
  sessions: []
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
