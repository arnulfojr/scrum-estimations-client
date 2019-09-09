<template>
  <div id="app">
    <navigation-bar></navigation-bar>
    <router-view />
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";

export default {
  components: {
    NavigationBar
  },
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
