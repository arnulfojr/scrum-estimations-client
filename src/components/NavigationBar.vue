<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
      <router-link to="/" tag="b-navbar-brand">Home</router-link>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <router-link
            tag="b-nav-item"
            to="/organization"
            v-if="isAuthenticated"
          >
            Organization
          </router-link>
        </b-navbar-nav>

        <b-navbar-nav>
          <router-link tag="b-nav-item" to="/sequences" v-if="isAuthenticated">
            Sequences
          </router-link>
        </b-navbar-nav>

        <b-navbar-nav>
          <router-link tag="b-nav-item" to="/sessions" v-if="isAuthenticated">
            Sessions
          </router-link>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-button v-if="!isAuthenticated" size="sm" @click="doLogin">
            Login
          </b-button>
          <b-button v-if="isAuthenticated" size="sm" @click="doLogOut">
            Logout
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false
    };
  },
  async created() {
    try {
      await this.$store.dispatch("auth/renewTokens");
    } catch (e) {
      /* ignore */
    }
  },
  methods: {
    doLogin() {
      this.$auth.login();
    },
    doLogOut() {
      this.$auth.logOut();
    },
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>
