// users module
import * as R from "ramda";
import userService from "@/services/UserService";

const actions = {
  async ensureUser({ dispatch, commit }, { email, name = "" }) {
    let user;

    const userId = await dispatch("exists", { email });
    if (userId) {
      user = await dispatch("get", { userId });
    } else {
      user = await dispatch("create", { email, name });
    }

    commit("SET_USER", user);

    return user;
  },
  async create({ dispatch }, { email, name }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    userService.accessToken = accessToken;

    let user;
    try {
      user = await userService.create(email, name);
    } catch (error) {
      throw R.pathOr(error, ["data"], error);
    }

    return user;
  },
  async exists({ dispatch }, { email }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    userService.accessToken = accessToken;

    let userId;
    try {
      userId = await userService.exists(email);
    } catch (error) {
      return false;
    }

    return userId;
  },
  async get({ dispatch }, { userId }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    userService.accessToken = accessToken;

    let user;
    try {
      user = await userService.get(userId);
    } catch (error) {
      return R.pathOr(error, ["data"], error);
    }

    return user;
  },
  async getOrganization({ dispatch }, { userId }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    userService.accessToken = accessToken;

    let organization = null;
    try {
      organization = await userService.getUserOrganization(userId);
    } catch (error) {
      /* ignore */
    }

    return organization;
  }
};

const getters = {};

const mutations = {
  SET_USER: (state, user = {}) => {
    state.user = user;
  }
};

const state = {
  user: null
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
