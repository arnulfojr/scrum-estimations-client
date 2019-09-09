// root mutations

export default {
  SET_ORGANIZATION_SESSIONS: (state, sessions) => {
    state.sessions = sessions;
  },
  SET_USER: (state, user = {}) => {
    state.user = user;
  },
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken;
  }
};
