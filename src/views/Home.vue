<template>
  <div class="home">
    <!-- replace image with the Coount von Count from Sesame Street  -->
    <img alt="Vue logo" src="../assets/logo.png" />
    <p v-if="user">Welcome {{ user.name }}!</p>
    <p v-else>Welcome anonymous!</p>
    <p v-if="organization">You're part of the "{{ organization.name }}" organization!</p>
    <p v-else>Let's get you started by joining or creating an organization!</p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {
      isAuthenticated: false,
      profile: null
    };
  },
  computed: {
    ...mapState({
      user: 'user',
      organization: 'organization'
    })
  },
  created() {
    // redirect to org section until we have an organization
    if (this.$store.state.organization === null) {
      this.$router.push("/organization");
    }
  },
  methods: {
    handleLoginEvent(data) {
      this.isAuthenticated = data.loggedIn;
      this.profile = data.profile;
    }
  }
};
</script>
