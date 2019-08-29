<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">My Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link v-if="isAuthenticated" to="/profile">Profile</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
