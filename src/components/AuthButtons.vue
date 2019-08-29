<template>
  <div>
    <div v-if="!isAuthenticated">
      <button class="btn-login" @click="doLogin">
        <slot>Login</slot>
      </button>
    </div>
    <div v-if="isAuthenticated">
      <button class="btn-logout" @click="doLogOut">
        <slot>Logout</slot>
      </button>
    </div>
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
      await this.$auth.renewTokens();
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
