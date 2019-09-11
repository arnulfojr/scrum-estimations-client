import * as R from "ramda";
import organizationService from "@/services/OrganizationService";

const actions = {
  async create({ commit, dispatch }, { organization, user = null }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    organizationService.accessToken = accessToken;

    const org = await organizationService.create(organization);
    commit("SET_ORGANIZATION", org);

    if (!R.isNil(user) && !R.isEmpty(user)) {
      await dispatch("join", {
        organization,
        user
      });
    }

    return org;
  },

  async join({ commit, dispatch }, { organization, user }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    organizationService.accessToken = accessToken;

    const organizationId = R.path(["id"], organization);
    const userId = R.path(["id"], user);

    const jointResponse = await organizationService.addUserTo(
      organizationId,
      userId
    );

    const organizationToCommit = R.pathOr(
      organization,
      ["organization"],
      jointResponse
    );
    commit("SET_ORGANIZATION", organizationToCommit);

    commit("SET_USER", user, { root: true });
  },

  async leave({ commit, dispatch }, { organization, user }) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    organizationService.accessToken = accessToken;

    const organizationId = R.path(["id"], organization);
    const userId = R.path(["id"], user);
    await organizationService.leave(organizationId, userId);

    commit("SET_ORGANIZATION", null);
  },

  async search({ dispatch }, nameHint) {
    const accessToken = await dispatch("auth/setAccessToken", null, {
      root: true
    });
    organizationService.accessToken = accessToken;

    const organizations = await organizationService.all(nameHint);
    return organizations;
  }
};

const getters = {};

const mutations = {
  SET_ORGANIZATION: (state, organization = {}) => {
    state.organization = organization;
  }
};

const state = {
  organization: null
};

export default {
  actions,
  getters,
  mutations,
  namespaced: true,
  state
};
