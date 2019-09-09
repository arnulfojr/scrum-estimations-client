// services
import authService from "@/services/AuthService";

export default {
  async setAccessToken({ commit }) {
    let accessToken = null;
    try {
      accessToken = await authService.getAccessToken();
    } catch (error) {
      /* ignore */
    }

    commit("SET_ACCESS_TOKEN", accessToken);
    return accessToken;
  }
};
