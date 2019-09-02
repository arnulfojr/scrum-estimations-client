<template>
  <div class="home">
    <!-- replace image with the Coount von Count from Sesame Street  -->
    <img alt="Vue logo" src="../assets/logo.png" />
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      isAuthenticated: false,
      profile: null
    };
  },
  methods: {
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>
