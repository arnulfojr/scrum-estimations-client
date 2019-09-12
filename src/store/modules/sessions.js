// sessions module
import * as R from "ramda";
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
  },
  async create({ dispatch }, { name, organization, sequence }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    sessionService.accessToken = accessToken;

    try {
      return sessionService.create(name, sequence, organization);
    } catch (error) {
      throw R.pathOr(error, ["data"], error);
    }
  },
  async join({ dispatch }, { session, user, organization }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    sessionService.accessToken = accessToken;

    let response;
    try {
      response = await sessionService.join(session, user);
    } catch (error) {
      throw R.pathOr(error, ["data"], error);
    }

    const organizationId = R.path(["id"], organization);
    await dispatch("fetchForOrganization", {
      organizationId
    });

    return R.path(["data"], response);
  },
  async leave({ dispatch }, { session, user, organization }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    sessionService.accessToken = accessToken;

    let response;
    try {
      response = await sessionService.leave(session, user);
    } catch (error) {
      throw R.pathOr(error, ["data"], error);
    }

    const organizationId = R.path(["id"], organization);
    await dispatch("fetchForOrganization", {
      organizationId
    });

    return R.path(["data"], response);
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
